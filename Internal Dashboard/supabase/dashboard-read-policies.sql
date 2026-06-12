-- Dashboard read access for the Supabase anon key.
-- The internal dashboard queries Team, GameStat, and PlayerRecord using the
-- public anon key. When RLS is enabled without anon SELECT policies, Supabase
-- returns HTTP 200 with an empty array (no error).
--
-- Only apply this if the dashboard URL is access-controlled (VPN, Cloudflare
-- Access, etc.). The anon key is embedded in the web bundle.

CREATE POLICY "dashboard_anon_read_team"
  ON "Team"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "dashboard_anon_read_gamestat"
  ON "GameStat"
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "dashboard_anon_read_playerrecord"
  ON "PlayerRecord"
  FOR SELECT
  TO anon
  USING (true);
