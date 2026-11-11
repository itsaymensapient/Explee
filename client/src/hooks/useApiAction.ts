import { useState } from "react";
import { toast } from "sonner";
import {
  ApiError,
  apiFetch,
  extractTaskId,
  isTerminalTask,
  toastMessageForError,
} from "@/lib/api";

export type ActionState = {
  loading: boolean;
  polling: boolean;
  error: string | null;
  code: string | null;
  status: number | null;
  data: unknown;
  taskId: string | null;
  success: boolean;
};

const initial: ActionState = {
  loading: false,
  polling: false,
  error: null,
  code: null,
  status: null,
  data: null,
  taskId: null,
  success: false,
};

export function useApiAction() {
  const [state, setState] = useState<ActionState>(initial);

  async function run<T = unknown>(
    path: string,
    init?: RequestInit,
    options?: { pollPath?: (taskId: string) => string; successToast?: string },
  ): Promise<T | null> {
    setState({ ...initial, loading: true });
    try {
      const data = await apiFetch<T>(path, init);
      const taskId = extractTaskId(data);

      if (taskId && options?.pollPath) {
        setState({
          loading: false,
          polling: true,
          error: null,
          code: null,
          status: 200,
          data,
          taskId,
          success: false,
        });
        toast.message("Job started", { description: `Polling task ${taskId}` });
        const polled = await pollTask(options.pollPath(taskId), taskId);
        return polled as T;
      }

      setState({
        loading: false,
        polling: false,
        error: null,
        code: null,
        status: 200,
        data,
        taskId,
        success: true,
      });
      if (options?.successToast) toast.success(options.successToast);
      return data;
    } catch (err) {
      if (err instanceof ApiError) {
        setState({
          loading: false,
          polling: false,
          error: err.message,
          code: err.code ?? null,
          status: err.status,
          data: err.details ?? null,
          taskId: null,
          success: false,
        });
        toast.error(toastMessageForError(err));
      } else {
        setState({
          loading: false,
          polling: false,
          error: err instanceof Error ? err.message : "Unknown error",
          code: null,
          status: null,
          data: null,
          taskId: null,
          success: false,
        });
        toast.error(toastMessageForError(err));
      }
      return null;
    }
  }

  async function pollTask(path: string, taskId: string): Promise<unknown> {
    let attempt = 0;
    while (attempt < 40) {
      attempt += 1;
      await sleep(attempt < 5 ? 1200 : 2000);
      try {
        const data = await apiFetch(path);
        setState((prev) => ({
          ...prev,
          polling: true,
          data,
          taskId,
          error: null,
          success: false,
        }));
        if (isTerminalTask(data) || attempt >= 40) {
          setState({
            loading: false,
            polling: false,
            error: null,
            code: null,
            status: 200,
            data,
            taskId,
            success: true,
          });
          toast.success("Job finished");
          return data;
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setState({
            loading: false,
            polling: false,
            error: err.message,
            code: err.code ?? null,
            status: err.status,
            data: err.details ?? null,
            taskId,
            success: false,
          });
          toast.error(toastMessageForError(err));
          return null;
        }
      }
    }
    setState((prev) => ({ ...prev, polling: false }));
    toast.message("Polling stopped", {
      description: "Task still running — poll again with the task id.",
    });
    return null;
  }

  function reset() {
    setState(initial);
  }

  return { state, run, reset };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
