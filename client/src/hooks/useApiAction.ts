import { useState } from "react";
import {
  ApiError,
  apiFetch,
  extractTaskId,
  isTerminalTask,
} from "@/lib/api";

export type ActionState = {
  loading: boolean;
  polling: boolean;
  error: string | null;
  code: string | null;
  data: unknown;
  taskId: string | null;
};

const initial: ActionState = {
  loading: false,
  polling: false,
  error: null,
  code: null,
  data: null,
  taskId: null,
};

export function useApiAction() {
  const [state, setState] = useState<ActionState>(initial);

  async function run<T = unknown>(
    path: string,
    init?: RequestInit,
    options?: { pollPath?: (taskId: string) => string },
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
          data,
          taskId,
        });
        const polled = await pollTask(options.pollPath(taskId), taskId);
        return polled as T;
      }

      setState({
        loading: false,
        polling: false,
        error: null,
        code: null,
        data,
        taskId,
      });
      return data;
    } catch (err) {
      if (err instanceof ApiError) {
        setState({
          loading: false,
          polling: false,
          error: err.message,
          code: err.code ?? null,
          data: err.details ?? null,
          taskId: null,
        });
      } else {
        setState({
          loading: false,
          polling: false,
          error: err instanceof Error ? err.message : "Unknown error",
          code: null,
          data: null,
          taskId: null,
        });
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
        }));
        if (isTerminalTask(data) || attempt >= 40) {
          setState({
            loading: false,
            polling: false,
            error: null,
            code: null,
            data,
            taskId,
          });
          return data;
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setState({
            loading: false,
            polling: false,
            error: err.message,
            code: err.code ?? null,
            data: err.details ?? null,
            taskId,
          });
          return null;
        }
      }
    }
    setState((prev) => ({ ...prev, polling: false }));
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
