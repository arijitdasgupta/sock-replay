defmodule ExReplay.Tooling do
  def restart do
    Application.stop(:exreplay)
    Application.ensure_all_started(:exreplay)
  end
end
