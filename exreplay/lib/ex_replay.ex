defmodule ExReplay do
  require Logger

  defp dispatch do
    [
      {:_, [
        {"/ws", ExReplay.ExSockets, []},
        {:_, Plug.Adapters.Cowboy.Handler, {ExReplay.Router, []}}
      ]}
    ]
  end

  def start(redis_host, redis_port) do
    start(redis_host, redis_port, 9090)
  end

  def start(redis_host, redis_port, socket_port) do
    Logger.info("Connecting to Redis at host: #{redis_host}, port: #{redis_port}")
    Logger.info("Socket port: #{socket_port}")

    children = [
      %{
        id: "#{__MODULE__}.redis.connection",
        start: {Agent, :start_link, [(fn -> Redix.start_link(host: redis_host, port: redis_port) end)]} # Redis link
      },
      {Plug.Cowboy, scheme: :http, plug: ExReplay.ExPlug,  options: [port: socket_port, dispatch: dispatch()]}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
