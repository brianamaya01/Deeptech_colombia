# 🇨🇴 DeepTech Colombia — Dashboard 2023 · 2024 · 2025

Dashboard interactivo que compara tres años de evolución del ecosistema de empresas de base científico-tecnológica (EBCTs) en Colombia, construido a partir de los informes anuales publicados por la **Alianza DeepTech Colombia** (MenteX · OlarteMoure Abogados).

🌐 **[Ver dashboard en vivo](https://brianamaya01.github.io/Deeptech_colombia/)**

---

## ¿Qué muestra el dashboard?

### 📊 KPIs comparativos
Evolución año a año de los indicadores clave del ecosistema:
- Número de EBCTs mapeadas (32 → 49 → 98)
- Capital levantado en USD ($60M → $108M)
- Empleos directos generados (500 → 820)
- Participación de fundadoras mujeres (37.5% → 49% → 58%)

### 🏭 Sectores y verticales
Análisis comparativo de las verticales deeptech:
- AgriFood Tech · HealthTech / BioMed · Energía / CleanTech · Materiales
- Peso relativo de cada sector en cada año
- Tecnologías habilitadoras: BioTech, IA, IoT, Materiales Avanzados, Blockchain

### 🗺️ Distribución geográfica
Mapa de concentración del ecosistema por ciudad y región:
- Bogotá · Medellín · Oriente · Occidente · Eje Cafetero
- Evolución de la descentralización 2023–2025

### 💰 Financiamiento
Fuentes de capital que usan las startups deeptech colombianas:
- Bootstrapping · Capital público · Venture Capital · Deuda · Grants internacionales

### 🎯 Sectores deeptech — verticales, desafíos y empresas
Sección dedicada a cada vertical con:
- Número de empresas por sector
- Desafíos estructurales identificados en los informes
- Comparativa de crecimiento entre años

---

## Fuentes de datos

| Informe | Año | Publicado por |
|---|---|---|
| Informe DeepTech Colombia 2023 | 2023 | MenteX · OlarteMoure Abogados |
| Informe Sciencepreneurs 2024 | 2024 | Alianza DeepTech Colombia |
| Informe Sciencepreneurs 2025 | 2025 | Alianza DeepTech Colombia |

> Los datos presentados son indicativos de tendencias. Los informes no usan exactamente la misma metodología en todos los años, por lo que algunas comparativas son aproximadas. Siempre se recomienda consultar los reportes originales.

---

## Stack técnico

- **React 19** + **Vite 8**
- **Recharts** — gráficas interactivas
- **GitHub Actions** — CI/CD automático al hacer push a `main`
- **GitHub Pages** — hosting vía branch `gh-pages`

## Correr localmente

```bash
git clone https://github.com/brianamaya01/Deeptech_colombia.git
cd Deeptech_colombia
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Deploy

Cada push a `main` dispara el workflow de GitHub Actions que construye el proyecto y publica en GitHub Pages automáticamente.

```bash
# Build manual
npm run build

# Deploy manual (requiere permisos de escritura al repo)
npm run deploy
```

---

*Construido con datos de la Alianza DeepTech Colombia. Este dashboard es un ejercicio de visualización independiente — no es un producto oficial de MenteX ni de OlarteMoure Abogados.*
