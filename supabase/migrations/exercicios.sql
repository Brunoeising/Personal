-- Configuração do Supabase Storage para upload de arquivos de exercícios
-- Execute estes comandos no SQL Editor do Supabase

-- 1. Criar bucket para mídia de exercícios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exercise-media',
  'exercise-media',
  true,
  52428800, -- 50MB em bytes
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/quicktime',
    'video/webm'
  ]
);

-- 2. Política para permitir upload (INSERT)
CREATE POLICY "Users can upload exercise media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'exercise-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Política para permitir visualização (SELECT)
CREATE POLICY "Exercise media is publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'exercise-media');

-- 4. Política para permitir atualização (UPDATE)
CREATE POLICY "Users can update own exercise media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'exercise-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Política para permitir exclusão (DELETE)
CREATE POLICY "Users can delete own exercise media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'exercise-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Criar tabela exercises se não existir
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  category TEXT NOT NULL,
  equipment TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Habilitar RLS na tabela exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- 8. Políticas para a tabela exercises
CREATE POLICY "Users can view public exercises and own exercises" ON public.exercises
FOR SELECT USING (
  is_public = true OR 
  auth.uid() = trainer_id
);

CREATE POLICY "Users can insert own exercises" ON public.exercises
FOR INSERT WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Users can update own exercises" ON public.exercises
FOR UPDATE USING (auth.uid() = trainer_id);

CREATE POLICY "Users can delete own exercises" ON public.exercises
FOR DELETE USING (auth.uid() = trainer_id);

-- 9. Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Índices para performance
CREATE INDEX idx_exercises_trainer_id ON public.exercises(trainer_id);
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX idx_exercises_is_public ON public.exercises(is_public);
CREATE INDEX idx_exercises_created_at ON public.exercises(created_at DESC);