REVOKE EXECUTE ON FUNCTION public.touch_sitter_activity() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.touch_sitter_activity() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_sitter_response_time(uuid) FROM PUBLIC, anon, authenticated;