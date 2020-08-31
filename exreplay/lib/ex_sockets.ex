defmodule ExReplay.ExSockets do
  require Logger
  @behaviour :cowboy_websocket

  # Cowboy WS imple
  def init(req, []) do
    {:cowboy_websocket, req, []}
  end

  def websocket_handle({:text, msg}, state) do
    Logger.info("Incoming #{msg}, #{inspect(self())}")
    ExReplay.ExSocketProcs.add_or_update_session("sesh", self())
    {:ok, state}
  end

  def websocket_info({:msg, msg}, state) do
    command = [{:text, msg}]
    {command, state}
  end

  def websocket_info(:close, state) do
    {:stop, state}
  end

  # Helper functions
  def send_to_socket(pid, msg) do
    Logger.info("#{inspect(pid)}")
    send(pid, {:msg, msg})
  end

  def close_socket(pid) do
    Logger.info("#{inspect(pid)}")
    send(pid, :close)
  end
end
