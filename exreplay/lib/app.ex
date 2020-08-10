defmodule ExReplayApplication do
  require Logger

  def start do
    start(:normal, [])
  end

  def start(_type, _args) do
    Logger.info("Development application starting")

    redis_host = Application.fetch_env!(:exreplay, :redis_host)
    redis_port = Application.fetch_env!(:exreplay, :redis_port)

    children = [
      %{
        id: ExReplay,
        start: {ExReplay, :start, [redis_host, redis_port]}
      }
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end

  @doc """
  Hello world.

  ## Examples

      iex> ExReplay.hello()
      :world

  """
  def hello do
    :world
  end
end
