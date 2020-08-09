defmodule ExReplay do
  @moduledoc """
  Documentation for `ExReplay`.
  """

  def start do
    start(:normal, [])
  end

  def start(_type, _args) do
    IO.puts("Hello World")
    {:ok, self()}
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
