# IA locale sur le PC de génération

Le PC fixe peut générer les textes localement avec Ollama. Les clients ne
contactent jamais Ollama ni ComfyUI : seul le serveur StoryKid les appelle sur
`127.0.0.1`.

## 1. Installer Ollama sur le PC

Installe Ollama, puis, dans PowerShell ou un terminal :

```bash
ollama pull qwen3:8b
ollama run qwen3:8b "Réponds simplement : prêt"
```

Ollama écoute normalement sur `http://127.0.0.1:11434`. Ne change pas cette
adresse en IP publique.

## 2. Configurer StoryKid

Dans `server/.env` sur le PC fixe :

```dotenv
STORY_TEXT_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:8b
STORY_IMAGE_PROVIDER=gemini
```

Puis démarre le serveur :

```bash
npm install
npm run dev --workspace=server
```

Les textes des aperçus et des livres complets sont alors générés par le PC.
Les illustrations continuent temporairement avec Gemini : elles restent plus
cohérentes que des images locales sans workflow verrouillé.

## 3. Images avec ComfyUI (phase suivante)

Installe ComfyUI sur le PC fixe, choisis un modèle compatible avec sa VRAM et
crée un workflow API qui accepte : prompt, image de couverture de référence,
image précédente et ratio. Ce workflow doit être testé avec plusieurs livres
avant d’être branché à la production, car la cohérence du personnage dépend de
ces références.

Quand il est validé, ComfyUI reste sur `http://127.0.0.1:8188` et le serveur
utilisera `COMFYUI_BASE_URL`. Il ne faut jamais ouvrir le port 8188 sur
Internet ; le serveur StoryKid est le seul intermédiaire autorisé.

## Vérification

```bash
curl http://127.0.0.1:11434/api/tags
curl http://127.0.0.1:8188/system_stats
```

Le premier doit afficher `qwen3:8b`. Le second ne fonctionne qu’après
l’installation de ComfyUI.
