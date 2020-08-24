defmodule ExReplay.ExSockets do
  require Logger
  @behaviour :cowboy_websocket

  def init(req, state) do
    Logger.info("Initiated")
    {:cowboy_websocket, req, state}
  end

  # def websocket_init(req, _opts) do
  #   Logger.info("#{req}")
  #   state = %{}
  #   {:ok, req, state, @timeout}
  # end

  def websocket_handle({:text, msg}, state) do
    Logger.info(msg)
    # {:reply, {:text, "Ooof!"}, state}
    {[{:text, msg}], state}
  end

  def websocket_info(_into, _state) do
    Logger.info("Gone")
  end
end
