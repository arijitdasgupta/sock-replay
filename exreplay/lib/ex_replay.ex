defmodule ExReplay do
  require Logger

  # Add option for extra handlers
  defp dispatch do
    [
      {:_, [
        {"/ws", ExReplay.ExSockets, []},
        {:_, Plug.Cowboy.Handler, {ExReplay.ExRouter, []}}
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
        id: ExReplay.ExSocketProces,
        start: {ExReplay.ExSocketProcs, :start_link, []}
      },
      {Plug.Cowboy, scheme: :http, plug: ExReplay.ExPlug,  options: [port: socket_port, dispatch: dispatch()]}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
