defmodule ExReplay do
  require Logger

  def start(redis_host, redis_port) do
    Logger.info("Connecting to Redis at host: #{redis_host}, port: #{redis_port}")


    {:ok, conn} = Redix.start_link(host: redis_host, port: redis_port)

    children = [
      %{
        id: "some",
        start: {Agent, :start_link, [(fn -> [] end)]}
      }
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
