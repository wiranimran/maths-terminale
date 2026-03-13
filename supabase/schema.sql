-- ══════════════════════════════════════════════════════════
--  Maths Terminale — Schema Supabase
--  À exécuter dans : Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- Table principale (clé-valeur partagée prof/élève)
CREATE TABLE IF NOT EXISTS classroom_data (
  key         TEXT PRIMARY KEY,
  value       JSONB        NOT NULL DEFAULT 'null'::jsonb,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes par clé
CREATE INDEX IF NOT EXISTS idx_classroom_data_key ON classroom_data (key);

-- ─── Trigger : updated_at automatique ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON classroom_data;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON classroom_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ────────────────────────────────────
ALTER TABLE classroom_data ENABLE ROW LEVEL SECURITY;

-- Politique : l'anon key peut lire et écrire
-- (adapté au modèle prof/élève à accès partagé)
DROP POLICY IF EXISTS "allow_all_with_anon_key" ON classroom_data;
CREATE POLICY "allow_all_with_anon_key" ON classroom_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─── Activer Supabase Realtime sur la table ────────────────
-- IMPORTANT : sans ceci, les subscriptions temps réel ne fonctionnent pas
ALTER PUBLICATION supabase_realtime ADD TABLE classroom_data;

-- ─── Données initiales (optionnel) ────────────────────────
-- Les données migrées depuis localStorage seront insérées
-- automatiquement par l'app au premier chargement.
-- Aucune insertion manuelle nécessaire.
