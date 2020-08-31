defmodule ExReplay.ExSocketProcs do
  def start_link() do
    {:ok, state_pid} = Agent.start_link(fn -> %{} end)
    true = Process.register(state_pid, :sessionToSocketMap)
    {:ok, state_pid}
  end

  def add_or_update_session(session_id, pid) do
    Agent.update(:sessionToSocketMap, fn (state) -> Map.put(state, session_id, pid) end)
  end

  def send_to_session(session_id) do
    {:ok, socket_pid} = get_session_by_id(session_id)
    ExReplay.ExSockets.send_to_socket(socket_pid, "Hello World!")
  end

  def close_socket_session(session_id) do
    {:ok, socket_pid} = get_session_by_id(session_id)
    ExReplay.ExSockets.close_socket(socket_pid)
  end

  defp get_session_by_id(session_id) do
    Agent.get(:sessionToSocketMap, fn (state) -> Map.fetch(state, session_id) end)
  end
end
