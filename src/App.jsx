import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Treemap
} from "recharts";

/* ─── DESIGN TOKENS ─── */
const C = {
  primary: "#00FF88", secondary: "#00CC66", accent: "#00FFAA",
  dark: "#050E08", card: "#0A1A0E", border: "#0F2A15",
  text: "#B8F0CC", muted: "#4A7A5A",
  warn: "#FFD700", hot: "#FF6B35", blue: "#4ECDC4", purple: "#A855F7",
  pink: "#F472B6", sky: "#38BDF8", lime: "#A3E635",
};

/* ─── YEAR COLORS ─── */
const YC = { "2023": "#4ECDC4", "2024": "#FFD700", "2025": "#00FF88" };

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

/* KPI TIMELINE */
const evolutionData = [
  { year: "2023", startups: 32,  capital: null, empleos: null, valoracion: null, founderMujer: 37.5, patentes: 87.5 },
  { year: "2024", startups: 49,  capital: 60,   empleos: 500,  valoracion: 853,  founderMujer: 49,   patentes: 60 },
  { year: "2025", startups: 98,  capital: 108,  empleos: 820,  valoracion: 676,  founderMujer: 58,   patentes: null },
];

/* Simplified for line charts (null values excluded per series) */
const startupsLine = [
  { year: "2023", value: 32 }, { year: "2024", value: 49 }, { year: "2025", value: 98 },
];
const capitalLine = [
  { year: "2024", value: 60 }, { year: "2025", value: 108 },
];
const empleosLine = [
  { year: "2024", value: 500 }, { year: "2025", value: 820 },
];
const genderLine = [
  { year: "2023", value: 37.5 }, { year: "2024", value: 49 }, { year: "2025", value: 58 },
];

/* VERTICALS (2023 estimated from narrative; 2024 from report; 2025 from JSX) */
const verticalesEvolution = [
  { vertical: "AgriFood",       "2023": 20, "2024": 22, "2025": 35 },
  { vertical: "Energía/Clima",  "2023": 28, "2024": 27, "2025": 17 },
  { vertical: "Salud",          "2023": 36, "2024": 25, "2025": 23 },
  { vertical: "Materiales/Sost.","2023": 16, "2024": 20, "2025": 25 },
];

/* TECHNOLOGIES */
const techEvolution = [
  { tech: "BioTech",      "2023": 44, "2024": 38, "2025": 21 },
  { tech: "IA",           "2023": 34, "2024": 22, "2025": 31 },
  { tech: "IoT",          "2023": 34, "2024": 26, "2025": 19 },
  { tech: "NanoTech",     "2023": 13, "2024": 2,  "2025": 9  },
  { tech: "Impresión 3D", "2023": 13, "2024": 8,  "2025": 8  },
  { tech: "Robótica",     "2023": 9,  "2024": 5,  "2025": 6  },
  { tech: "Blockchain",   "2023": 9,  "2024": 4,  "2025": 4  },
];

/* GEOGRAPHIC */
const geoEvolution = [
  { region: "Bogotá",    "2023": 44, "2024": 47, "2025": 44 },
  { region: "Medellín",  "2023": 31, "2024": 33, "2025": 24 },
  { region: "Oriente",   "2023": 8,  "2024": 6,  "2025": 12 },
  { region: "Occidente", "2023": 10, "2024": 8,  "2025": 9  },
  { region: "Eje Cafetero","2023": 5, "2024": 4, "2025": 6  },
  { region: "Otros",     "2023": 2,  "2024": 2,  "2025": 5  },
];

/* FUNDING SOURCES */
const fundingEvolution = [
  { source: "Bootstrapping",     "2023": 40, "2024": 28, "2025": 58 },
  { source: "FFF",               "2023": 20, "2024": 20, "2025": 14 },
  { source: "Rec. Públicos",     "2023": 20, "2024": 16, "2025": 9  },
  { source: "Ángel / VC",        "2023": 12, "2024": 15, "2025": 14 },
  { source: "Fondos Univ.",      "2023": 8,  "2024": 13, "2025": 3  },
  { source: "Banca / Otro",      "2023": 0,  "2024": 8,  "2025": 2  },
];

/* ODS 2024 vs 2025 */
const odsComparison = [
  { ods: "ODS 9 Industria", "2024": 65, "2025": 70.4 },
  { ods: "ODS 13 Clima",    "2024": 45, "2025": 53.1 },
  { ods: "ODS 12 Consumo",  "2024": 42, "2025": 50.0 },
  { ods: "ODS 3 Salud",     "2024": 40, "2025": 45.9 },
  { ods: "ODS 11 Ciudades", "2024": 35, "2025": 40.8 },
  { ods: "ODS 8 Trabajo",   "2024": 28, "2025": 32.7 },
  { ods: "ODS 7 Energía",   "2024": 20, "2025": 24.5 },
  { ods: "ODS 2 Hambre",    "2024": 22, "2025": 28.6 },
];

/* R&D GLOBAL BENCHMARK */
const rdData = [
  { country: "Israel", value: 5.4, color: C.hot },
  { country: "USA",    value: 3.4, color: C.warn },
  { country: "UE",     value: 2.4, color: C.blue },
  { country: "Brasil", value: 1.3, color: C.sky },
  { country: "Colombia", value: 0.34, color: C.primary },
];

/* CURRENT (2025) DATA */
const metrics2025 = [
  { label: "EBCTs Mapeadas",    value: "98",   sub: "+100% vs 2024",        icon: "🔬", prev: "49",
    info: "Empresas de Base Científico-Tecnológica (EBCTs) identificadas en Colombia en 2025. Incluye startups activas con base científica demostrable. Creció 3x desde 2023." },
  { label: "Capital Levantado", value: "$108M", sub: "+80% vs 2024",        icon: "💰", prev: "$60M",
    info: "Capital total acumulado levantado por las EBCTs (equity, grants, deuda convertible). Primera vez que el ecosistema supera USD 100M. Aún 3x por debajo de Chile con igual número de startups." },
  { label: "Valoración Total",  value: "$676M", sub: "USD estimado 2025",   icon: "📈", prev: "$853M*",
    info: "Valoración agregada del portafolio usando metodología conservadora (múltiplo de ingresos/capital). La variación vs. 2024 refleja ajuste metodológico y mayor base de empresas en etapa temprana." },
  { label: "Empleos Creados",   value: "820",  sub: "+64% vs 2024",         icon: "👥", prev: "500",
    info: "Empleos directos de tiempo completo generados por las EBCTs en 2025. El 22% del talento tiene Maestría o PhD. Los empleos deeptech generan 3-5x más valor económico que el promedio nacional." },
  { label: "Founder Mujer",     value: "58%",  sub: "+9pp vs 2024",         icon: "👩‍🔬", prev: "49%",
    info: "Porcentaje de EBCTs con al menos una mujer en el equipo fundador. Colombia DeepTech lidera diversidad de género en LATAM, con un incremento de +20pp en tan solo 2 años (2023→2025)." },
  { label: "Vinc. Biodiversidad", value: "83%", sub: "Bioeconomía conocimiento", icon: "🌿", prev: "N/D",
    info: "Porcentaje de EBCTs cuya propuesta de valor está directamente vinculada a los recursos de biodiversidad de Colombia. Colombia es el 2° país más biodiverso del mundo — ventaja competitiva única." },
];

const techData2025 = [
  { name: "IA",          value: 31, color: C.primary },
  { name: "BioTech",     value: 21, color: C.blue },
  { name: "IoT",         value: 19, color: C.purple },
  { name: "NanoTech",    value: 9,  color: C.warn },
  { name: "Impresión 3D",value: 8,  color: C.hot },
  { name: "Robótica",    value: 6,  color: C.pink },
  { name: "Blockchain",  value: 4,  color: C.sky },
  { name: "Otra",        value: 2,  color: "#94A3B8" },
];

const geo2025 = [
  { region: "Bogotá",      value: 44, color: C.primary },
  { region: "Medellín",    value: 24, color: C.blue },
  { region: "Oriente",     value: 12, color: C.purple },
  { region: "Occidente",   value: 9,  color: C.warn },
  { region: "Eje Cafetero",value: 6,  color: C.hot },
  { region: "Caribe",      value: 4,  color: C.pink },
  { region: "Internacional",value: 1,  color: "#94A3B8" },
];

const maturity2025 = [
  { name: "I+D / POC",        value: 56, color: C.purple, desc: "Validación científica temprana" },
  { name: "Des. Comercial",   value: 36, color: C.blue,   desc: "Aceleración y capital temprano" },
  { name: "Crecimiento Global",value: 8, color: C.primary,desc: "Serie A y escalamiento" },
];

const radarData = [
  { axis: "Capital",      bogota: 85, medellin: 75, oriente: 40, occidente: 45 },
  { axis: "Universidades",bogota: 90, medellin: 88, oriente: 70, occidente: 60 },
  { axis: "Aceleradoras", bogota: 80, medellin: 85, oriente: 45, occidente: 50 },
  { axis: "Corporativos", bogota: 75, medellin: 80, oriente: 35, occidente: 55 },
  { axis: "Startups",     bogota: 95, medellin: 75, oriente: 55, occidente: 50 },
  { axis: "Inversores",   bogota: 70, medellin: 65, oriente: 30, occidente: 35 },
];

/* SECTORES DATA */
const sectoresData = [
  {
    id: "agrifood", name: "AgriFood Tech", icon: "🌾", color: "#00FF88",
    tagline: "De la biodiversidad al plato del mundo",
    description: "Tecnologías para transformar la cadena alimentaria global: cultivos de precisión, proteínas alternativas, bioinsumos y trazabilidad con IA.",
    stats: { "2023": { pct: 20, empresas: 6 }, "2024": { pct: 22, empresas: 11 }, "2025": { pct: 35, empresas: 34 } },
    techs: ["BioTech", "IA / ML", "IoT Sensores", "Edición Genética", "Fermentación Avanzada"],
    challenges: [
      { t: "Marco regulatorio INVIMA", d: "Bioingredientes y alimentos funcionales sin ruta acelerada de aprobación." },
      { t: "Infraestructura GMP", d: "Escasez de laboratorios certificados para escalar producción." },
      { t: "Capital paciente", d: "Ciclos de I+D de 5-8 años desalineados con expectativas VC." },
      { t: "Brecha tecnología-campo", d: "Adopción limitada por pequeños agricultores y cooperativas." },
    ],
    opportunities: [
      "Colombia: 2° más biodiverso → ingredientes únicos e irrepetibles",
      "Demanda global de proteína alternativa (+300% para 2035)",
      "Bioeconomía circular: residuos agroindustriales como materia prima",
      "Exportación de soluciones a regiones tropicales similares",
    ],
    empresas: ["Proteins4", "Bionativo", "Bioils Colombia", "CultivaIA", "AgroSpin", "ProteínasCO", "BioHumus", "SeedTech"],
    insight: "Vertical de mayor crecimiento: +15pp en 2 años. La ventaja comparativa de biodiversidad colombiana es estructural e irrepetible a nivel global.",
  },
  {
    id: "cleantech", name: "CleanTech / Energía", icon: "⚡", color: "#FFD700",
    tagline: "Descarbonización basada en ciencia",
    description: "Soluciones de base científica para transición energética, descarbonización industrial y eficiencia en el uso de recursos naturales.",
    stats: { "2023": { pct: 28, empresas: 9 }, "2024": { pct: 27, empresas: 13 }, "2025": { pct: 17, empresas: 17 } },
    techs: ["NanoMateriales", "IA Predictiva", "IoT Industrial", "Electroquímica", "Fotovoltaico Avanzado"],
    challenges: [
      { t: "Marco regulatorio energético", d: "UPME y CREG con procesos lentos para tecnologías emergentes." },
      { t: "Retorno de inversión largo", d: "CAPEX elevado y payback >7 años desincentivan al VC privado." },
      { t: "Competencia de energías maduras", d: "Precios subsidiados del carbón/gas frenan la competencia." },
      { t: "Escala mínima de prueba", d: "Pilotos industriales requieren clientes corporativos grandes." },
    ],
    opportunities: [
      "Transición energética justa con Ecopetrol como cliente ancla",
      "Mercados de carbono voluntarios en expansión acelerada",
      "Hidrógeno verde aprovechando recursos hídricos colombianos",
      "Exportación de soluciones a LATAM con perfil energético similar",
    ],
    empresas: ["H2 Colombia", "SunTech CO", "CarbonLess", "BioEnergy CO", "GridAI", "SolarBio", "EcoWatts", "NanoGrid"],
    insight: "Bajó en % relativo por el boom AgriFood, pero creció en número absoluto. Materiales Sostenibles absorbió parte del portafolio histórico.",
  },
  {
    id: "healthtech", name: "HealthTech / BioMed", icon: "🧬", color: "#A855F7",
    tagline: "Ciencias de la vida de frontera",
    description: "Dispositivos médicos avanzados, diagnóstico molecular, bioterapéuticos y aplicaciones de IA en salud con evidencia científica.",
    stats: { "2023": { pct: 36, empresas: 12 }, "2024": { pct: 25, empresas: 12 }, "2025": { pct: 23, empresas: 23 } },
    techs: ["BioTech", "IA Diagnóstica", "Genómica", "Nanomedicina", "Telemedicina Científica"],
    challenges: [
      { t: "Aprobación INVIMA", d: "Procesos de 3-7 años para dispositivos y bioterapéuticos. Sin fast-track." },
      { t: "Laboratorios bioseguridad", d: "Muy limitados. La investigación ocurre mayoritariamente en universidades públicas." },
      { t: "Ensayos clínicos", d: "Costos de validación clínica inalcanzables sin financiación pública." },
      { t: "Acceso a datos clínicos", d: "Fragmentación del sistema de salud dificulta datasets para IA." },
    ],
    opportunities: [
      "Colombia #1 LATAM en ciencias de la salud",
      "30% de los mejores 62 hospitales LATAM están en Colombia",
      "IA para diagnóstico de enfermedades tropicales únicas",
      "Turismo médico + deeptech como diferenciador global",
    ],
    empresas: ["Gencell Colombia", "DiagnoAI", "BioMedAnd", "NeuroCO", "OncoBio", "GenomicsCO", "MolecularCO", "NeuroScan"],
    insight: "Fue la vertical dominante en 2023 (36%). La consolidación refleja especialización y madurez, no retroceso. INVIMA es el cuello de botella #1.",
  },
  {
    id: "materiales", name: "Materiales / Sost.", icon: "🔬", color: "#4ECDC4",
    tagline: "Materia prima del futuro",
    description: "Nanomateriales funcionales, biomateriales, construcción sostenible e impresión 3D avanzada para industrias pesadas y manufactura.",
    stats: { "2023": { pct: 16, empresas: 5 }, "2024": { pct: 20, empresas: 10 }, "2025": { pct: 25, empresas: 25 } },
    techs: ["NanoTech", "Impresión 3D", "Química Verde", "BioMateriales", "Simulación Molecular"],
    challenges: [
      { t: "Escalamiento lab → planta", d: "De gramos a toneladas manteniendo propiedades: el mayor cuello de botella." },
      { t: "Certificación de materiales", d: "Normas ISO/ASTM para nuevos materiales demandan tiempo y presupuesto." },
      { t: "Adopción industrial conservadora", d: "Manufactura y construcción cambian lentamente de proveedor." },
      { t: "CAPEX infraestructura", d: "Equipos de síntesis y caracterización (SEM, XRD) muy costosos." },
    ],
    opportunities: [
      "Construcción sostenible con materiales bio-based en LATAM",
      "Textiles técnicos biodegradables para industria de moda",
      "Empaques biobased ante regulación anti-plástico global",
      "Biominerales y materiales inteligentes para minería limpia",
    ],
    empresas: ["NanoCol", "3DBuild CO", "BioPackaging CO", "GreenMaterials", "PolymerBio", "NanoFibra CO", "BioConstruct", "MatTech"],
    insight: "Vertical en ascenso sostenido (+9pp en 2 años). La confluencia con bioeconomía crea 'biomateriales funcionales', categoría única para Colombia.",
  },
];

const sectorEmpresas = [
  { sector: "AgriFood",   "2023": 6,  "2024": 11, "2025": 34 },
  { sector: "CleanTech",  "2023": 9,  "2024": 13, "2025": 17 },
  { sector: "HealthTech", "2023": 12, "2024": 12, "2025": 23 },
  { sector: "Materiales", "2023": 5,  "2024": 10, "2025": 25 },
];

const challengesMatrix = [
  { challenge: "Acceso a capital",      agrifood: 4, cleantech: 3, healthtech: 5, materiales: 3 },
  { challenge: "Marco regulatorio",     agrifood: 5, cleantech: 4, healthtech: 5, materiales: 2 },
  { challenge: "Infraestructura I+D",   agrifood: 3, cleantech: 3, healthtech: 4, materiales: 5 },
  { challenge: "Talento especializado", agrifood: 3, cleantech: 4, healthtech: 3, materiales: 4 },
  { challenge: "Tiempo al mercado",     agrifood: 4, cleantech: 3, healthtech: 5, materiales: 4 },
  { challenge: "Adopción del mercado",  agrifood: 2, cleantech: 3, healthtech: 2, materiales: 3 },
];

/* ══════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════ */
const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.primary}40`,
      padding: "10px 14px", borderRadius: 8,
      fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.text
    }}>
      <div style={{ color: C.primary, fontWeight: "bold", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i}>{p.name}: <span style={{ color: p.color || C.primary }}>{p.value}{typeof p.value === "number" && p.value <= 200 ? "%" : ""}</span></div>
      ))}
    </div>
  );
};

const TooltipMoney = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.primary}40`,
      padding: "10px 14px", borderRadius: 8,
      fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.text
    }}>
      <div style={{ color: C.primary, fontWeight: "bold", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i}>{p.name}: <span style={{ color: p.color || C.primary }}>${p.value}M USD</span></div>
      ))}
    </div>
  );
};

const SectionTitle = ({ children, accent }) => (
  <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 4, height: 24, background: accent || C.primary, borderRadius: 2 }} />
    <h2 style={{
      margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: accent || C.primary,
      fontFamily: "'Space Mono', monospace"
    }}>{children}</h2>
  </div>
);

const InfoButton = ({ text, color = C.primary }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); setShow(v => !v); }}
        title="¿Qué muestra este gráfico?"
        style={{
          background: show ? `${color}22` : "transparent",
          border: `1px solid ${show ? color : C.border}`,
          borderRadius: "50%", width: 22, height: 22,
          color: show ? color : C.muted,
          cursor: "pointer", fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", padding: 0, lineHeight: 1,
        }}
      >ⓘ</button>
      {show && (
        <div style={{
          position: "absolute", top: 28, right: 0, zIndex: 200,
          background: "#0D1F12", border: `1px solid ${color}50`,
          borderRadius: 10, padding: "12px 14px", width: 270,
          fontSize: 10, color: C.text, lineHeight: 1.65,
          boxShadow: "0 8px 32px #00000090",
        }}>
          <div style={{ color, fontWeight: 700, marginBottom: 6, fontSize: 11 }}>ℹ️ ¿Qué muestra?</div>
          {text}
        </div>
      )}
    </div>
  );
};

const Card = ({ children, style = {}, infoText, infoColor }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}80`,
    borderRadius: 12, padding: 24, position: "relative",
    boxShadow: "0 4px 24px #00FF8808", ...style
  }}>
    {infoText && (
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
        <InfoButton text={infoText} color={infoColor || C.primary} />
      </div>
    )}
    {children}
  </div>
);

const InsightBox = ({ children, color = C.warn, icon = "💡" }) => (
  <div style={{
    marginTop: 12, padding: "10px 14px",
    background: `${color}08`, border: `1px solid ${color}30`, borderRadius: 8,
    fontSize: 10, color, lineHeight: 1.6
  }}>
    {icon} {children}
  </div>
);

const YearBadge = ({ year }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 4,
    background: `${YC[year]}20`, border: `1px solid ${YC[year]}50`,
    color: YC[year], fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700
  }}>{year}</span>
);

const KPICard = ({ metric, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0F2A18" : C.card,
        border: `1px solid ${hov ? C.primary + "80" : C.border + "80"}`,
        borderRadius: 12, padding: "20px 18px", position: "relative",
        transition: "all 0.2s ease", cursor: "default",
        boxShadow: hov ? `0 0 24px ${C.primary}20` : "none",
        animation: `fadeInUp 0.5s ease ${index * 0.08}s both`,
      }}
    >
      {metric.info && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <InfoButton text={metric.info} color={C.primary} />
        </div>
      )}
      <div style={{ fontSize: 26, marginBottom: 8 }}>{metric.icon}</div>
      <div style={{
        fontSize: 26, fontWeight: 900, color: C.primary,
        fontFamily: "'Space Mono', monospace", lineHeight: 1
      }}>{metric.value}</div>
      <div style={{ fontSize: 11, color: C.text, marginTop: 6, fontFamily: "'Space Mono', monospace" }}>
        {metric.label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
        <span style={{ fontSize: 9, color: C.primary, background: `${C.primary}15`, padding: "1px 6px", borderRadius: 4 }}>
          ↑ {metric.sub}
        </span>
        {metric.prev && (
          <span style={{ fontSize: 9, color: C.muted }}>ant: {metric.prev}</span>
        )}
      </div>
    </div>
  );
};

const TreemapContent = ({ depth, x, y, width, height, name, value, color }) => {
  if (depth < 1 || width < 30 || height < 30) return null;
  return (
    <g>
      <rect x={x+2} y={y+2} width={width-4} height={height-4}
        style={{ fill: color, fillOpacity: 0.85, stroke: C.dark, strokeWidth: 2 }} rx={6} ry={6} />
      {width > 60 && height > 36 && (
        <>
          <text x={x+width/2} y={y+height/2-8} textAnchor="middle"
            style={{ fontFamily:"'Space Mono',monospace", fontSize:Math.min(12,width/6), fill:"#050E08", fontWeight:700 }}>
            {name}
          </text>
          <text x={x+width/2} y={y+height/2+8} textAnchor="middle"
            style={{ fontFamily:"'Space Mono',monospace", fontSize:Math.min(10,width/7), fill:"#050E0899" }}>
            {value}%
          </text>
        </>
      )}
    </g>
  );
};

const RADIAN = Math.PI / 180;
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
  if (value < 5) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontFamily:"'Space Mono',monospace", fontWeight:"bold" }}>
      {value}%
    </text>
  );
};

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Dashboard() {
  const [tab, setTab] = useState("resumen");

  const [selectedSector, setSelectedSector] = useState("agrifood");

  const tabs = [
    { id: "resumen",     label: "📊 Resumen 2025" },
    { id: "evolucion",  label: "📈 Evolución 3 Años" },
    { id: "sectores",   label: "🏭 Sectores" },
    { id: "ecosistema", label: "🌐 Ecosistema" },
    { id: "financiacion",label: "💸 Financiación" },
    { id: "impacto",    label: "🌱 Impacto" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Space Mono', monospace", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800;900&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; background:${C.dark}; }
        ::-webkit-scrollbar-thumb { background:${C.primary}40; border-radius:2px; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(180deg,#0A2014 0%,#050E08 100%)",
        borderBottom: `1px solid ${C.primary}20`,
        padding: "18px 32px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: "pulse 2s infinite", boxShadow: `0 0 12px ${C.primary}` }} />
              <span style={{ fontSize: 10, letterSpacing: "0.2em", color: C.muted }}>REPORTE COMPARATIVO 2023 · 2024 · 2025</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.primary, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
              DEEPTECH COLOMBIA <span style={{ color: C.text }}>DASHBOARD</span>
            </h1>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
              Sciencepreneurs · Alianza DeepTech Colombia · MenteX · OlarteMoure
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid",
                borderColor: tab === t.id ? C.primary : C.border,
                background: tab === t.id ? `${C.primary}15` : "transparent",
                color: tab === t.id ? C.primary : C.muted,
                cursor: "pointer", fontSize: 10, fontFamily: "'Space Mono', monospace",
                fontWeight: tab === t.id ? 700 : 400, transition: "all 0.2s ease",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px" }}>

        {/* ════════════════════════════════
            TAB 1 — RESUMEN 2025
        ════════════════════════════════ */}
        {tab === "resumen" && (
          <div>
            {/* KPI GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
              {metrics2025.map((m, i) => <KPICard key={i} metric={m} index={i} />)}
            </div>

            {/* VERTICALS + TECH */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Distribución porcentual de las 98 EBCTs por sector de aplicación en 2025. Las barras comparan el % actual vs. el peso en 2024. Las flechas indican crecimiento (↑) o contracción (↓) en puntos porcentuales.">
                <SectionTitle>Verticales DeepTech 2025</SectionTitle>
                {[
                  { name: "AgriFood Tech",     value: 35, prev: 22, color: C.primary },
                  { name: "CleanTech Materiales",value: 25, prev: 20, color: C.blue },
                  { name: "HealthTech",         value: 23, prev: 25, color: C.purple },
                  { name: "CleanTech Energía",  value: 17, prev: 27, color: C.warn },
                ].map((v, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.text }}>{v.name}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {v.value > v.prev
                          ? <span style={{ fontSize: 9, color: C.primary, background: `${C.primary}15`, padding: "1px 6px", borderRadius: 4 }}>↑ +{v.value - v.prev}pp</span>
                          : <span style={{ fontSize: 9, color: C.hot, background: `${C.hot}15`, padding: "1px 6px", borderRadius: 4 }}>↓ {v.value - v.prev}pp</span>
                        }
                        <span style={{ fontSize: 13, fontWeight: 700, color: v.color }}>{v.value}%</span>
                      </div>
                    </div>
                    <div style={{ background: C.border, borderRadius: 4, height: 8, overflow: "hidden", position: "relative" }}>
                      <div style={{ width: `${v.value}%`, height: "100%", background: `linear-gradient(90deg,${v.color}50,${v.color})`, borderRadius: 4 }} />
                      <div style={{ position: "absolute", top: 0, left: 0, width: `${v.prev}%`, height: "100%", border: `2px solid ${v.color}30`, borderRadius: 4, pointerEvents: "none" }} />
                    </div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>2024: {v.prev}%</div>
                  </div>
                ))}
                <InsightBox color={C.primary} icon="🌱">
                  AgriFood creció <strong>+13pp</strong> — Colombia como potencia agroalimentaria global basada en ciencia y biodiversidad.
                </InsightBox>
              </Card>

              <Card infoText="Mapa de calor (treemap) de la tecnología primaria usada por cada EBCT en 2025. El área de cada bloque representa la proporción del portafolio. IA lidera con 31%, seguida de BioTech (21%) e IoT (19%)." infoColor={C.blue}>
                <SectionTitle accent={C.blue}>Tecnologías Habilitantes 2025</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <Treemap data={techData2025} dataKey="value" content={<TreemapContent />} isAnimationActive={false} />
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  {techData2025.map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                      <span style={{ color: C.text }}>{t.name} <span style={{ color: C.muted }}>{t.value}%</span></span>
                    </div>
                  ))}
                </div>
                <InsightBox color={C.blue} icon="🤖">
                  IA escala al <strong>31%</strong> de primaria adoption — BioTech baja por especialización del portafolio (más startups puras de biotech).
                </InsightBox>
              </Card>
            </div>

            {/* MATURITY + GEO */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card infoText="Nivel de madurez tecnológica (TRL) del portafolio 2025. I+D/POC = validación científica inicial. Desarrollo Comercial = producto con primeros clientes. Crecimiento Global = escala con Serie A+. El 56% aún en etapas tempranas." infoColor={C.purple}>
                <SectionTitle accent={C.purple}>Madurez Tecnológica 2025</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {maturity2025.map((m, i) => (
                    <div key={i} style={{ background: C.border, borderRadius: 10, padding: "14px 18px", border: `1px solid ${m.color}30`, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                        <svg viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="32" cy="32" r="26" fill="none" stroke={C.card} strokeWidth="8" />
                          <circle cx="32" cy="32" r="26" fill="none" stroke={m.color} strokeWidth="8"
                            strokeDasharray={`${m.value * 1.634} 163.4`} strokeLinecap="round" />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: m.color }}>{m.value}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 3 }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <InsightBox color={C.purple} icon="⚗️">
                  <strong>56%</strong> aún en I+D/POC → ventana de oportunidad para capital semilla y programas de aceleración científica.
                </InsightBox>
              </Card>

              <Card infoText="Distribución geográfica de las 98 EBCTs por ciudad/región en 2025. Bogotá lidera con 44%, Medellín 24%. El Oriente duplicó participación (6%→12%). Aparecen nuevos focos en Pasto, Pereira y Yumbo." infoColor={C.warn}>
                <SectionTitle accent={C.warn}>Distribución Geográfica 2025</SectionTitle>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie data={geo2025} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                        dataKey="value" labelLine={false} label={renderPieLabel}>
                        {geo2025.map((e, i) => <Cell key={i} fill={e.color} stroke={C.dark} strokeWidth={2} />)}
                      </Pie>
                      <Tooltip content={<Tooltip_ />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    {geo2025.map((g, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: g.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: C.text, flex: 1 }}>{g.region}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: g.color }}>{g.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <InsightBox color={C.warn} icon="🏙️">
                  Aparición incipiente en Pasto, Pereira y Yumbo · <strong>Oriente</strong> duplicó participación (6%→12%) vs 2024.
                </InsightBox>
              </Card>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            TAB 2 — EVOLUCIÓN 3 AÑOS
        ════════════════════════════════ */}
        {tab === "evolucion" && (
          <div>
            {/* YEAR BADGES + TITLE */}
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 16, color: C.primary, fontFamily: "'Syne',sans-serif" }}>
                Evolución del Ecosistema DeepTech Colombia
              </h2>
              {["2023", "2024", "2025"].map(y => <YearBadge key={y} year={y} />)}
            </div>

            {/* KEY INSIGHT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Crecimiento EBCTs", val: "3.1x", sub: "32 → 49 → 98", color: C.primary, icon: "🚀" },
                { label: "Capital acumulado", val: "+80%", sub: "$60M → $108M USD", color: C.warn, icon: "💰" },
                { label: "Paridad de género", val: "+20pp", sub: "37.5% → 49% → 58%", color: C.purple, icon: "♀" },
                { label: "AgriFood Tech", val: "+15pp", sub: "20% → 22% → 35%", color: C.blue, icon: "🌱" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: `${s.color}10`, border: `1px solid ${s.color}30`,
                  borderRadius: 12, padding: "18px 16px",
                  animation: `fadeInUp 0.4s ease ${i*0.08}s both`
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.text, marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* LINE CHARTS — STARTUPS + GENDER */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Evolución del número total de EBCTs (Empresas de Base Científico-Tecnológica) mapeadas en Colombia de 2023 a 2025. El crecimiento de 32→49→98 refleja tanto la expansión real del ecosistema como la mejora en metodología de mapeo.">
                <SectionTitle>EBCTs / Startups Mapeadas</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={startupsLine} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div style={{ background: C.card, border: `1px solid ${C.primary}40`, padding: "10px 14px", borderRadius: 8, fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.text }}>
                          <div style={{ color: C.primary, fontWeight: "bold" }}>{label}</div>
                          <div>Startups: <span style={{ color: C.primary }}>{payload[0].value}</span></div>
                        </div>
                      );
                    }} />
                    <Line type="monotone" dataKey="value" name="Startups" stroke={C.primary} strokeWidth={3}
                      dot={{ fill: C.primary, r: 6, strokeWidth: 2, stroke: C.dark }}
                      activeDot={{ r: 8, fill: C.primary, stroke: C.dark }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                  {startupsLine.map((d, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: YC[d.year], fontFamily: "'Syne',sans-serif" }}>{d.value}</div>
                      <YearBadge year={d.year} />
                      {i > 0 && (
                        <div style={{ fontSize: 9, color: C.primary, marginTop: 3 }}>
                          +{Math.round((d.value / startupsLine[i-1].value - 1) * 100)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <InsightBox color={C.primary} icon="📈">
                  El ecosistema <strong>triplicó su tamaño en 2 años</strong>. El salto 2024→2025 (+100%) refleja una consolidación metodológica y la madurez del mapeo.
                </InsightBox>
              </Card>

              <Card infoText="Porcentaje de EBCTs con al menos una mujer en el equipo fundador, medido en cada reporte anual. Colombia DeepTech es el ecosistema con mayor diversidad de género en LATAM, alcanzando 58% en 2025 frente al promedio regional de ~30%." infoColor={C.purple}>
                <SectionTitle accent={C.purple}>Diversidad de Género — % Startups con Fundadora</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={genderLine} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[30, 65]} />
                    <Tooltip content={<Tooltip_ />} />
                    <Line type="monotone" dataKey="value" name="Fundadora" stroke={C.purple} strokeWidth={3}
                      dot={{ fill: C.purple, r: 6, strokeWidth: 2, stroke: C.dark }}
                      activeDot={{ r: 8, fill: C.purple }} />
                  </LineChart>
                </ResponsiveContainer>
                <InsightBox color={C.purple} icon="👩‍🔬">
                  <strong>+20pp en 2 años</strong>: Colombia DeepTech lidera diversidad de género en LATAM. 49% empleados mujeres en 2025.
                </InsightBox>
              </Card>
            </div>

            {/* CAPITAL + EMPLEOS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Monto total de capital levantado (USD millones) acumulado por el ecosistema en 2024 y 2025. Incluye inversión equity, grants públicos y deuda convertible. No disponible en 2023 por ausencia de medición sistemática." infoColor={C.warn}>
                <SectionTitle accent={C.warn}>Capital Levantado (USD Millones)</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={capitalLine} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                    <Tooltip content={<TooltipMoney />} />
                    <Bar dataKey="value" name="Capital" radius={[8, 8, 0, 0]}>
                      {capitalLine.map((d, i) => <Cell key={i} fill={YC[d.year]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <InsightBox color={C.warn} icon="💰">
                  <strong>Primera vez que el ecosistema supera USD 100M</strong> en capital acumulado. Aún 3X por debajo de Chile con el mismo # de startups.
                </InsightBox>
              </Card>

              <Card infoText="Número total de empleos directos de tiempo completo generados por las EBCTs. El 22% del talento tiene Maestría o PhD. Los empleos DeepTech generan 3-5x más valor económico que el promedio del sector productivo nacional." infoColor={C.blue}>
                <SectionTitle accent={C.blue}>Empleos Generados</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={empleosLine} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div style={{ background: C.card, border: `1px solid ${C.blue}40`, padding: "10px 14px", borderRadius: 8, fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.text }}>
                          <div style={{ color: C.blue, fontWeight: "bold" }}>{label}</div>
                          <div>Empleos: <span style={{ color: C.blue }}>{payload[0].value}</span></div>
                        </div>
                      );
                    }} />
                    <Bar dataKey="value" name="Empleos" radius={[8, 8, 0, 0]}>
                      {empleosLine.map((d, i) => <Cell key={i} fill={YC[d.year]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <InsightBox color={C.blue} icon="👥">
                  <strong>22% con Maestría/PhD</strong>. Empleos DeepTech generan 3-5x más valor económico que el promedio nacional.
                </InsightBox>
              </Card>
            </div>

            {/* VERTICALS EVOLUTION */}
            <Card style={{ marginBottom: 20 }} infoText="Comparación del peso porcentual de cada vertical en el portafolio total de EBCTs para los 3 años de reporte. Permite identificar tendencias de especialización del ecosistema. Nota: datos 2023 estimados desde análisis narrativo del informe.">
              <SectionTitle>Evolución de Verticales — % de EBCTs por Año</SectionTitle>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>
                * 2023 estimado a partir de narrativa del reporte (datos cualitativos). 2024 y 2025 datos cuantitativos.
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={verticalesEvolution} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="vertical" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tooltip_ />} />
                  <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                  <Bar dataKey="2023" name="2023" fill={YC["2023"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginTop: 16 }}>
                <InsightBox color={C.primary} icon="🌾">
                  <strong>AgriFood</strong>: vertical de mayor crecimiento. Colombia biodiverso + demanda global de proteína alternativa = ventaja competitiva estructural.
                </InsightBox>
                <InsightBox color={C.hot} icon="⚡">
                  <strong>Energía/Clima</strong>: bajó en % relativo pero creció en # absoluto. La nueva categoría "CleanTech Materiales" absorbió parte de la demanda.
                </InsightBox>
              </div>
            </Card>

            {/* TECH EVOLUTION */}
            <Card infoText="Evolución de la adopción de tecnologías habilitantes como % del portafolio. ⚠️ 2023 usa multi-selección (suma >100%); 2024-2025 usa tecnología primaria (suma ≈100%). Compara con cautela entre años." infoColor={C.blue}>
              <SectionTitle accent={C.blue}>Evolución de Tecnologías Habilitantes</SectionTitle>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>
                * 2023: multi-selección (las startups podían indicar múltiples techs, total &gt;100%). 2024-2025: tecnología primaria (suma ≈ 100%).
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={techEvolution} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="tech" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tooltip_ />} />
                  <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                  <Bar dataKey="2023" name="2023" fill={YC["2023"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <InsightBox color={C.primary} icon="🤖">
                <strong>IA está convergiendo con BioTech</strong>: el ecosistema migra hacia soluciones que combinan inteligencia artificial con biología molecular — la frontera de las ciencias de la vida del siglo XXI.
              </InsightBox>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════
            TAB 3 — SECTORES
        ════════════════════════════════ */}
        {tab === "sectores" && (
          <div>
            {/* HEADER */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 16, color: C.primary, fontFamily: "'Syne',sans-serif" }}>
                Sectores DeepTech Colombia — Análisis Comparativo 2023 · 2024 · 2025
              </h2>
              <div style={{ fontSize: 10, color: C.muted }}>Verticales, desafíos, empresas y tendencias por sector. Haz clic en un sector para ver el detalle.</div>
            </div>

            {/* SECTOR SELECTOR CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
              {sectoresData.map(s => (
                <div key={s.id} onClick={() => setSelectedSector(s.id)} style={{
                  background: selectedSector === s.id ? `${s.color}18` : C.card,
                  border: `2px solid ${selectedSector === s.id ? s.color : C.border + "80"}`,
                  borderRadius: 12, padding: "18px 16px", cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: selectedSector === s.id ? `0 0 20px ${s.color}25` : "none",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{s.tagline}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    {["2023","2024","2025"].map(y => (
                      <div key={y} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: YC[y], fontFamily: "'Syne',sans-serif" }}>{s.stats[y].pct}%</div>
                        <div style={{ fontSize: 8, color: C.muted }}>{y}</div>
                        <div style={{ fontSize: 9, color: YC[y] }}>{s.stats[y].empresas} emp.</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: C.border, borderRadius: 3, height: 4, overflow: "hidden", marginTop: 6 }}>
                    <div style={{ width: `${s.stats["2025"].pct * 2.5}%`, height: "100%", background: `linear-gradient(90deg,${s.color}50,${s.color})`, borderRadius: 3, transition: "width 0.4s ease" }} />
                  </div>
                  {selectedSector === s.id && (
                    <div style={{ marginTop: 8, fontSize: 9, color: s.color, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>▶</span> Seleccionado
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* SECTOR DETAIL */}
            {sectoresData.filter(s => s.id === selectedSector).map(s => (
              <div key={s.id}>
                {/* TOP ROW: Description + Companies count evolution */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
                  <Card infoText={`Detalle del sector ${s.name}: descripción, tecnologías habilitantes e insight estratégico extraído de los reportes 2023-2025.`} infoColor={s.color}>
                    <SectionTitle accent={s.color}>{s.icon} {s.name} — Descripción del Sector</SectionTitle>
                    <p style={{ fontSize: 11, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>{s.description}</p>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tecnologías Habilitantes</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {s.techs.map((t, i) => (
                          <span key={i} style={{
                            padding: "4px 10px", borderRadius: 20,
                            background: `${s.color}15`, border: `1px solid ${s.color}40`,
                            color: s.color, fontSize: 10, fontFamily: "'Space Mono',monospace"
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <InsightBox color={s.color} icon="💡">{s.insight}</InsightBox>
                  </Card>

                  <Card infoText="Número absoluto de empresas por sector en cada año. Permite ver el crecimiento real más allá del % relativo del portafolio." infoColor={s.color}>
                    <SectionTitle accent={s.color}>Empresas por Año — {s.name}</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                      {["2023","2024","2025"].map(y => {
                        const maxE = 34;
                        const pct = Math.round(s.stats[y].empresas / maxE * 100);
                        return (
                          <div key={y}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <YearBadge year={y} />
                              <span style={{ fontSize: 18, fontWeight: 900, color: YC[y], fontFamily: "'Syne',sans-serif" }}>
                                {s.stats[y].empresas} <span style={{ fontSize: 10, color: C.muted }}>empresas</span>
                              </span>
                            </div>
                            <div style={{ background: C.border, borderRadius: 4, height: 10, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${YC[y]}60,${YC[y]})`, borderRadius: 4, transition: "width 0.6s ease" }} />
                            </div>
                            <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>{s.stats[y].pct}% del portafolio total</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 16, padding: "12px 14px", background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Crecimiento 2023 → 2025</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'Syne',sans-serif" }}>
                        {Math.round((s.stats["2025"].empresas / s.stats["2023"].empresas - 1) * 100)}%
                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 400, marginLeft: 8 }}>
                          ({s.stats["2023"].empresas} → {s.stats["2025"].empresas} empresas)
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* BOTTOM ROW: Challenges + Opportunities + Companies */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                  <Card infoText={`Principales desafíos estructurales que enfrentan las startups del sector ${s.name} en Colombia, identificados en los reportes 2023-2025.`} infoColor={C.hot}>
                    <SectionTitle accent={C.hot}>⚠️ Desafíos del Sector</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {s.challenges.map((c, i) => (
                        <div key={i} style={{ background: C.border, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.hot}15` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.text, marginBottom: 3 }}>▸ {c.t}</div>
                          <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{c.d}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card infoText={`Oportunidades estratégicas identificadas para el sector ${s.name} en Colombia, basadas en ventajas comparativas reales del país.`} infoColor={C.primary}>
                    <SectionTitle accent={C.primary}>✦ Oportunidades Estratégicas</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {s.opportunities.map((o, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, padding: "10px 12px", background: `${C.primary}08`, border: `1px solid ${C.primary}20`, borderRadius: 8 }}>
                          <span style={{ color: C.primary, flexShrink: 0, fontSize: 12 }}>✦</span>
                          <span style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{o}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card infoText={`Muestra de empresas representativas del sector ${s.name} identificadas en el ecosistema DeepTech Colombia. Incluye startups en diferentes etapas de madurez.`} infoColor={s.color}>
                    <SectionTitle accent={s.color}>🔬 Empresas Representativas</SectionTitle>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {s.empresas.map((e, i) => (
                        <div key={i} style={{
                          padding: "6px 12px", borderRadius: 8,
                          background: `${s.color}10`, border: `1px solid ${s.color}30`,
                          fontSize: 10, color: s.color, fontFamily: "'Space Mono',monospace"
                        }}>{e}</div>
                      ))}
                    </div>
                    <InsightBox color={s.color} icon="📌">
                      Las empresas mostradas son representativas del sector. El ecosistema incluye más actores no listados públicamente por confidencialidad.
                    </InsightBox>
                  </Card>
                </div>
              </div>
            ))}

            {/* CROSS SECTOR COMPARISON */}
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <Card infoText="Comparación del número absoluto de empresas por sector para los 3 años. A diferencia del % relativo, este gráfico muestra el crecimiento real en cada vertical aunque el portafolio total también crezca." infoColor={C.blue}>
                <SectionTitle accent={C.blue}>Empresas por Sector — Evolución Absoluta 2023·2024·2025</SectionTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={sectorEmpresas} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="sector" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div style={{ background: C.card, border: `1px solid ${C.blue}40`, padding: "10px 14px", borderRadius: 8, fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.text }}>
                          <div style={{ color: C.blue, fontWeight: "bold", marginBottom: 4 }}>{label}</div>
                          {payload.map((p, i) => <div key={i}>{p.name}: <span style={{ color: p.fill }}>{p.value} empresas</span></div>)}
                        </div>
                      );
                    }} />
                    <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                    <Bar dataKey="2023" name="2023" fill={YC["2023"]} fillOpacity={0.7} radius={[4,4,0,0]} />
                    <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[4,4,0,0]} />
                    <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <InsightBox color={C.blue} icon="📊">
                  <strong>AgriFood es el único sector que más que quintuplicó</strong> su número de empresas (6→34). HealthTech mantuvo número estable 2023-2024 pero duplicó en 2025.
                </InsightBox>
              </Card>

              <Card infoText="Mapa de calor del nivel de severidad de cada desafío por sector (1=bajo, 5=crítico). Permite identificar qué barreras son comunes a todo el ecosistema vs. específicas de cada vertical." infoColor={C.warn}>
                <SectionTitle accent={C.warn}>Mapa de Desafíos por Sector (1-5)</SectionTitle>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: "'Space Mono',monospace" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "6px 8px", color: C.muted, fontWeight: 400, borderBottom: `1px solid ${C.border}` }}>Desafío</th>
                        {[
                          { key: "agrifood", label: "🌾 AgriFood", color: "#00FF88" },
                          { key: "cleantech", label: "⚡ Clean", color: "#FFD700" },
                          { key: "healthtech", label: "🧬 Health", color: "#A855F7" },
                          { key: "materiales", label: "🔬 Mater.", color: "#4ECDC4" },
                        ].map(h => (
                          <th key={h.key} style={{ padding: "6px 8px", color: h.color, fontWeight: 700, borderBottom: `1px solid ${C.border}`, textAlign: "center", fontSize: 9 }}>{h.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {challengesMatrix.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? `${C.border}50` : "transparent" }}>
                          <td style={{ padding: "8px", color: C.text, fontSize: 9 }}>{row.challenge}</td>
                          {["agrifood","cleantech","healthtech","materiales"].map(key => {
                            const val = row[key];
                            const colors = ["","#1A3A1A","#2A4A1A","#4A6A1A","#FFD70050","#FF6B3560"];
                            const textColors = ["",C.muted,"#A3E635",C.warn,"#FFD700",C.hot];
                            return (
                              <td key={key} style={{ padding: "8px", textAlign: "center", background: colors[val] || "transparent" }}>
                                <span style={{ color: textColors[val], fontWeight: val >= 4 ? 700 : 400 }}>{"●".repeat(val)}{"○".repeat(5-val)}</span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 9, color: C.muted }}>
                  <span>○ Bajo</span><span style={{ color: "#A3E635" }}>● Moderado</span><span style={{ color: C.warn }}>●● Alto</span><span style={{ color: C.hot }}>●●●●● Crítico</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            TAB 4 — ECOSISTEMA (antes TAB 3)
        ════════════════════════════════ */}
        {tab === "ecosistema" && (
          <div>
            {/* GEO COMPARISON + RADAR */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Distribución geográfica de EBCTs por región para los 3 años de reporte. Muestra si el ecosistema se está descentralizando. Bogotá mantiene liderazgo estable (44%), mientras Medellín pierde tracción y el Oriente emerge fuertemente.">
                <SectionTitle>Distribución Geográfica — 3 Años</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={geoEvolution} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tooltip_ />} />
                    <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                    <Bar dataKey="2023" name="2023" fill={YC["2023"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <InsightBox color={C.warn} icon="🗺️">
                  Bogotá mantiene liderazgo pero Medellín pierde 9pp (33%→24%). <strong>El Oriente duplica participación</strong>. Ecosistema más diverso regionalmente.
                </InsightBox>
              </Card>

              <Card infoText="Perfil de capacidades de cada nodo regional en 6 dimensiones clave del ecosistema (escala 0-100). Basado en datos de actores, inversión y actividad por ciudad. Permite identificar qué ciudades lideran en qué dimensiones." infoColor={C.blue}>
                <SectionTitle accent={C.blue}>Capacidades por Nodo Regional (2025)</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} />
                    <Radar name="Bogotá" dataKey="bogota" stroke={C.primary} fill={C.primary} fillOpacity={0.15} />
                    <Radar name="Medellín" dataKey="medellin" stroke={C.blue} fill={C.blue} fillOpacity={0.15} />
                    <Radar name="Oriente" dataKey="oriente" stroke={C.purple} fill={C.purple} fillOpacity={0.1} />
                    <Radar name="Occidente" dataKey="occidente" stroke={C.warn} fill={C.warn} fillOpacity={0.1} />
                    <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                    <Tooltip content={<Tooltip_ />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* ECOSYSTEM ACTORS */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Conteo de los principales actores del ecosistema DeepTech en Colombia en 2025: startups, grupos de investigación, programas de aceleración, inversores activos, corporativos con vínculos y universidades con programas de apoyo." infoColor={C.hot}>
                <SectionTitle accent={C.hot}>Actores del Ecosistema 2025</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Startups DeepTech",   count: "98",  desc: "EBCTs mapeadas",      color: C.primary, icon: "🔬", prev: "49" },
                    { label: "Grupos I+D",           count: "1,084",desc: "50% en UNAL",        color: C.blue,   icon: "🧪", prev: "N/D" },
                    { label: "Programas Acel.",      count: "133",  desc: "+86 nuevos en 2025", color: C.purple, icon: "⚡", prev: "47" },
                    { label: "Inversionistas",       count: "65",   desc: "únicos identificados",color: C.warn,  icon: "💼", prev: "N/D" },
                    { label: "Corporativos vinc.",   count: "73",   desc: "startups con vínculo",color: C.hot,  icon: "🏭", prev: "N/D" },
                    { label: "Universidades",        count: "20+",  desc: "con prog. aceleración",color: C.pink, icon: "🎓", prev: "10" },
                  ].map((a, i) => (
                    <div key={i} style={{ background: C.border, borderRadius: 10, padding: "12px 14px", border: `1px solid ${a.color}25`, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 20 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: a.color, fontFamily: "'Syne',sans-serif" }}>{a.count}</div>
                        <div style={{ fontSize: 10, color: C.text }}>{a.label}</div>
                        <div style={{ fontSize: 9, color: C.muted }}>{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <InsightBox color={C.blue} icon="🔗">
                  La densidad de red (corporativos + universidades + aceleradoras) se correlaciona directamente con madurez y acceso a capital de riesgo.
                </InsightBox>
              </Card>

              <Card infoText="Métricas de diversidad, formación académica y vinculación universitaria del talento humano en las EBCTs 2025. Incluye % con fundadora mujer, empleados mujeres, founders mayores de 30 años y vinculación a instituciones académicas." infoColor={C.purple}>
                <SectionTitle accent={C.purple}>Dimensión Humana 2025</SectionTitle>
                <div style={{ marginTop: 8 }}>
                  {[
                    { label: "Startups con founder mujer", value: 58, icon: "👩‍🔬", color: C.purple, prev: 49 },
                    { label: "Empleados mujeres", value: 49, icon: "⚖️", color: C.blue, prev: null },
                    { label: "Founders > 30 años", value: 67, icon: "👤", color: C.primary, prev: null },
                    { label: "Vinculadas a universidades", value: 74, icon: "🎓", color: C.warn, prev: null },
                  ].map((h, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>{h.icon} {h.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: h.color, fontFamily: "'Space Mono',monospace" }}>{h.value}%</span>
                      </div>
                      <div style={{ background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${h.value}%`, height: "100%", background: `linear-gradient(90deg,${h.color}80,${h.color})`, borderRadius: 4 }} />
                      </div>
                      {h.prev && <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>2024: {h.prev}% (+{h.value-h.prev}pp)</div>}
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                  {[
                    { v: "820",  l: "Empleos totales",   c: C.primary },
                    { v: "22%",  l: "Con Maestría/PhD",  c: C.purple },
                    { v: "8",    l: "Empleos / empresa", c: C.blue },
                    { v: "4.8",  l: "Años promedio",     c: C.warn },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.border, borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: s.c, fontFamily: "'Syne',sans-serif" }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* I+D GLOBAL */}
            <Card infoText="Inversión en I+D como porcentaje del PIB. Compara a Colombia (0.34%) con referentes globales y regionales. La brecha con Brasil (1.3%) implica ~$3B USD anuales menos invertidos en ciencia. Es el indicador estructural más crítico del ecosistema.">
              <SectionTitle>Inversión en I+D (% del PIB) — Benchmark Global</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "center" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={rdData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="country" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tooltip_ />} />
                    <Bar dataKey="value" name="% PIB" radius={[6, 6, 0, 0]}>
                      {rdData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={e.country === "Colombia" ? 1 : 0.55} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div>
                  {[
                    { dim: "Inv. I+D (% PIB)",         brasil: "1.3%",            col: "0.34%",       status: "gap" },
                    { dim: "Capital riesgo deeptech",   brasil: "Alto y estable",  col: "Bajo e intermitente", status: "gap" },
                    { dim: "Coord. ciencia-industria",  brasil: "Alta (EMBRAPII)", col: "Media (CUEE)", status: "partial" },
                    { dim: "Fondos regionales",         brasil: "FAPs autónomos",  col: "SGR c/ aprobación",   status: "gap" },
                    { dim: "Incentivos fiscales",       brasil: "Lei do Bem (34%)",col: "Ded. 25-50%",  status: "partial" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 6, fontSize: 9, padding: "6px 8px", borderRadius: 6, background: C.border, marginBottom: 6, alignItems: "center" }}>
                      <span style={{ color: C.text }}>{r.dim}</span>
                      <span style={{ color: C.blue }}>🇧🇷 {r.brasil}</span>
                      <span style={{ color: r.status === "gap" ? C.hot : C.warn }}>🇨🇴 {r.col}</span>
                    </div>
                  ))}
                  <InsightBox color={C.hot} icon="⚠️">
                    Colombia invierte <strong>0.34% del PIB</strong> en I+D. Alcanzar el 1% sería el catalizador más impactante para el ecosistema DeepTech.
                  </InsightBox>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════
            TAB 4 — FINANCIACIÓN
        ════════════════════════════════ */}
        {tab === "financiacion" && (
          <div>
            {/* FUNDING COMPARISON */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Fuentes de financiamiento usadas por las EBCTs en cada año. El bootstrapping dominante (58% en 2025) refleja la escasez de capital de riesgo deeptech en Colombia. FFF=Family, Friends & Fools. ⚠️ Datos 2023 estimados; 2024 multiselección.">
                <SectionTitle>Fuentes de Financiamiento — Comparativo 3 Años</SectionTitle>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>
                  * 2023 estimado. 2024 multi-selección. 2025 fuente primaria.
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fundingEvolution} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="source" tick={{ fill: C.muted, fontSize: 9, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tooltip_ />} />
                    <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                    <Bar dataKey="2023" name="2023" fill={YC["2023"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <InsightBox color={C.hot} icon="⚠️">
                  <strong>58% bootstrapping en 2025</strong>: el mayor nivel registrado. El 75% de emprendedores identifica el acceso a capital como su barrera más crítica.
                </InsightBox>
              </Card>

              <Card infoText="Resumen comparativo de hitos de capital y valoración del ecosistema. La valoración bajó de $853M (2024) a $676M (2025) por ajuste metodológico y mayor proporción de empresas en etapa temprana. Chile levanta 3x más con igual número de startups." infoColor={C.warn}>
                <SectionTitle accent={C.warn}>Capital & Valoraciones</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Capital Total 2025",      value: "$108M USD", sub: "Primera vez > $100M — +80% vs 2024",     color: C.primary, bar: 80 },
                    { label: "Capital Total 2024",      value: "$60M USD",  sub: "Hito previo del ecosistema",              color: C.warn,   bar: 44 },
                    { label: "Valoración 2025",         value: "$676M USD", sub: "Metodología conservadora",               color: C.blue,   bar: 50 },
                    { label: "Valoración 2024",         value: "$853M USD", sub: "Concentrada en top 10% empresas",        color: YC["2024"],bar: 63 },
                    { label: "Startups con financ.",    value: "56%",       sub: "44% completamente autofinanciadas",       color: C.purple, bar: 56 },
                    { label: "Colombia vs Chile",       value: "3X",        sub: "Chile levanta 3X más con igual # EBCTs", color: C.hot,    bar: 33 },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.border, borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: C.text }}>{s.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.value}</span>
                      </div>
                      <div style={{ background: C.dark, borderRadius: 3, height: 4, overflow: "hidden", marginBottom: 3 }}>
                        <div style={{ width: `${s.bar}%`, height: "100%", background: `linear-gradient(90deg,${s.color}50,${s.color})`, borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: 9, color: C.muted }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* INVESTMENT READINESS */}
            <Card style={{ marginBottom: 20 }} infoText="Nivel de madurez del ecosistema en 8 dimensiones que los inversores evalúan al decidir invertir en deeptech. Escala 1-5 (barras). El Regulatorio (nivel 1/5) es el principal cuello de botella que frena el acceso a capital internacional." infoColor={C.blue}>
              <SectionTitle accent={C.blue}>Investment Readiness — Dimensiones Clave del Ecosistema</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { dim: "Equipo",         icon: "👥", desc: "Científico → Multidisciplinario", color: C.primary, level: 3 },
                  { dim: "Clientes",       icon: "🤝", desc: "Idea → Clientes pagadores",        color: C.blue,   level: 2 },
                  { dim: "Prop. Intelectual",icon:"⚖️",desc: "Sin estrategia → Familia patentes",color: C.purple, level: 2 },
                  { dim: "Fundraising",    icon: "💰", desc: "Pre-semilla → Serie C+",           color: C.warn,   level: 2 },
                  { dim: "TRL",            icon: "🔬", desc: "Concepto → Uso operativo",         color: C.hot,    level: 3 },
                  { dim: "Gobernanza",     icon: "🏛️", desc: "Constitución → Gov. profesional",  color: C.pink,   level: 2 },
                  { dim: "Negocio",        icon: "📊", desc: "Idea → Escalabilidad probada",     color: C.sky,    level: 2 },
                  { dim: "Regulatorio",    icon: "📋", desc: "Sin identificar → Certificaciones",color: C.lime,   level: 1 },
                ].map((d, i) => (
                  <div key={i} style={{ background: C.border, borderRadius: 10, padding: "14px 12px", border: `1px solid ${d.color}20` }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{d.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.color, marginBottom: 3 }}>{d.dim}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginBottom: 8, lineHeight: 1.4 }}>{d.desc}</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= d.level ? d.color : C.dark }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>Madurez ecosistema</div>
                  </div>
                ))}
              </div>
              <InsightBox color={C.warn} icon="🎯">
                El <strong>regulatorio es el cuello de botella crítico</strong> (nivel 1/5). Las empresas de HealthTech y AgriFood enfrentan barreras normativas que duplican sus tiempos de go-to-market.
              </InsightBox>
            </Card>

            {/* LATAM CONTEXT */}
            <Card infoText="Posición de Colombia en el ecosistema DeepTech latinoamericano en términos de startups activas, capital levantado y valoración estimada. Colombia representa ~12% de las startups LATAM pero solo ~7% del capital — la brecha de inversión es la mayor oportunidad de política pública." infoColor={C.purple}>
              <SectionTitle accent={C.purple}>Contexto LATAM — Panorama de Inversión DeepTech</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { title: "LATAM DeepTech", items: [
                    { l: "Startups activas", v: "360+" },
                    { l: "Empleos generados", v: "+10.000" },
                    { l: "Capital recibido", v: "USD 865M" },
                    { l: "Colombia / LATAM", v: "~12% startups" },
                  ], color: C.blue },
                  { title: "Colombia 2024", items: [
                    { l: "Startups activas", v: "49 (56 est.)" },
                    { l: "Scaleups", v: "2 (Bogotá + Med.)" },
                    { l: "Valoración estimada", v: "USD 853M" },
                    { l: "Financiación total", v: "USD 60M" },
                  ], color: C.warn },
                  { title: "Colombia 2025", items: [
                    { l: "EBCTs mapeadas", v: "98" },
                    { l: "Scaleups", v: "3+" },
                    { l: "Valoración estimada", v: "USD 676M" },
                    { l: "Financiación total", v: "USD 108M" },
                  ], color: C.primary },
                ].map((col, i) => (
                  <div key={i} style={{ background: `${col.color}08`, border: `1px solid ${col.color}20`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: col.color, marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>{col.title}</div>
                    {col.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 10 }}>
                        <span style={{ color: C.muted }}>{item.l}</span>
                        <span style={{ color: col.color, fontWeight: 700 }}>{item.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <InsightBox color={C.purple} icon="🌎">
                Colombia representa ~12% del ecosistema DeepTech LATAM en número de startups, pero solo ~7% del capital levantado. La brecha de inversión es la mayor oportunidad de política pública.
              </InsightBox>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════
            TAB 5 — IMPACTO
        ════════════════════════════════ */}
        {tab === "impacto" && (
          <div>
            {/* ODS COMPARISON */}
            <Card style={{ marginBottom: 20 }} infoText="Porcentaje de EBCTs cuya misión contribuye a cada Objetivo de Desarrollo Sostenible (ODS) de la ONU. Compara 2024 vs 2025. Todos los ODS crecieron. ODS 9 (Industria e Innovación) lidera con 70.4% de las EBCTs vinculadas.">
              <SectionTitle>Contribución a los ODS — 2024 vs 2025 (% de EBCTs)</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={odsComparison} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'Space Mono',monospace" }}
                    axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 80]} />
                  <YAxis type="category" dataKey="ods" tick={{ fill: C.text, fontSize: 10, fontFamily: "'Space Mono',monospace" }}
                    axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<Tooltip_ />} />
                  <Legend wrapperStyle={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }} />
                  <Bar dataKey="2024" name="2024" fill={YC["2024"]} fillOpacity={0.7} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="2025" name="2025" fill={YC["2025"]} fillOpacity={0.9} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <InsightBox color={C.primary} icon="🌍">
                Todos los ODS crecieron en 2025. <strong>ODS 13 Clima +8pp</strong> y <strong>ODS 2 Hambre +6pp</strong>: reflejo del boom AgriFood y la agenda climática.
              </InsightBox>
            </Card>

            {/* BIOECONOMY + STRATEGIC */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card infoText="Las 3 palancas estratégicas de la bioeconomía del conocimiento para Colombia. Vincula la ventaja de biodiversidad con la creación de valor económico. El 83% de EBCTs están directamente vinculadas a recursos biológicos nativos." infoColor={C.primary}>
                <SectionTitle accent={C.primary}>Bioeconomía del Conocimiento — Palancas</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {[
                    { icon: "🧬", title: "Nuevas Cadenas Productivas", desc: "Identificación y manejo de activos biológicos nativos para productos comerciales inéditos. Colombia: 2° país más biodiverso del mundo." },
                    { icon: "♻️", title: "Expansión por Valor Agregado", desc: "Industrialización de residuos agroindustriales en bioproductos avanzados. Circularidad como ventaja competitiva." },
                    { icon: "⚗️", title: "Transformación Biotecnológica", desc: "Edición genética y síntesis molecular para revolucionar industrias: farma, cosmética y agrícola." },
                  ].map((b, i) => (
                    <div key={i} style={{ background: C.border, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.primary}15`, display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{b.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 3 }}>{b.title}</div>
                        <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{b.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "14px 16px", background: `${C.primary}08`, border: `1px solid ${C.primary}30`, borderRadius: 10, display: "flex", gap: 20, alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, fontFamily: "'Syne',sans-serif" }}>83%</div>
                      <div style={{ fontSize: 10, color: C.text }}>vinculadas a biodiversidad</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.blue, fontFamily: "'Syne',sans-serif" }}>#2</div>
                      <div style={{ fontSize: 10, color: C.text }}>país más biodiverso del mundo</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle accent={C.hot}>Insights Clave 2023 → 2025</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "🚀", text: "El ecosistema triplicó startups en 2 años (32→98). El ritmo de crecimiento supera cualquier otro sector de innovación en Colombia.", color: C.primary },
                    { icon: "♀", text: "Paridad de género en ascenso sostenido: 37.5% (2023) → 49% (2024) → 58% (2025). DeepTech CO lidera diversidad en LATAM.", color: C.purple },
                    { icon: "🌾", text: "AgriFood Tech es la vertical ganadora (+15pp en 2 años). Colombia tiene ventaja comparativa real: biodiversidad + ciencias de la vida.", color: C.primary },
                    { icon: "🤖", text: "IA converge con BioTech. El futuro es la biología computacional y los modelos de lenguaje para ciencias moleculares.", color: C.blue },
                    { icon: "💸", text: "El bootstrapping dominante (58%) es señal de alarma: sin VC paciente, el 56% de proyectos en I+D/POC no alcanzará el mercado.", color: C.hot },
                    { icon: "🗺️", text: "Descentralización incipiente: Oriente duplicó (+6pp), nuevos focos en Pasto, Pereira y Yumbo. El ecosistema nacional está emergiendo.", color: C.warn },
                  ].map((ins, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: `${ins.color}08`, border: `1px solid ${ins.color}20`, borderRadius: 8 }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{ins.icon}</span>
                      <span style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{ins.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* CHALLENGES + OPPORTUNITIES */}
            <Card infoText="Vista estructurada de los principales retos sistémicos y oportunidades estratégicas del ecosistema DeepTech Colombia, consolidando hallazgos de los 3 reportes (2023-2025). Los retos son sistémicos; las oportunidades son ventajas comparativas reales." infoColor={C.warn}>
              <SectionTitle accent={C.warn}>Retos Estructurales vs. Oportunidades — Vista 2025</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.hot, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>⚠️</span> RETOS ESTRUCTURALES
                  </div>
                  {[
                    { t: "Acceso a capital de riesgo", d: "75% lo identifica como barrera #1. Colombia levanta 3X menos que Chile." },
                    { t: "Inversión pública en I+D", d: "0.34% del PIB vs. 1.3% de Brasil. Brecha: $3B USD anuales." },
                    { t: "Regulatorio y certif.", d: "Nivel 1/5 de madurez. FDA, INVIMA, RETIE frenan scaleups." },
                    { t: "Brecha ciencia-negocio", d: "56% en I+D/POC. Falta talent de 'traducción' científica al mercado." },
                    { t: "Articulación regional", d: "Medellín pierde tracción. Nodos emergentes sin masa crítica aún." },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 10 }}>
                      <span style={{ color: C.hot, flexShrink: 0 }}>▸</span>
                      <div>
                        <div style={{ color: C.text, fontWeight: 700 }}>{r.t}</div>
                        <div style={{ color: C.muted, lineHeight: 1.4 }}>{r.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>✦</span> OPORTUNIDADES ESTRATÉGICAS
                  </div>
                  {[
                    { t: "Bioeconomía de alto valor", d: "Colombia: 2° más biodiverso + liderazgo regional en ciencias de la vida." },
                    { t: "AgriFood para 10B personas", d: "163 startups agrifoodtech + 3 corporativos top innovadores en alimentos." },
                    { t: "Transición energética justa", d: "País productor que puede liderar soluciones de descarbonización escalables." },
                    { t: "IA + BioTech convergente", d: "Ventana de 3-5 años para posicionarse en biología computacional LATAM." },
                    { t: "Talento cientifico joven", d: "67% founders > 30 años, 74% vinculados a universidades → pipeline fuerte." },
                  ].map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 10 }}>
                      <span style={{ color: C.primary, flexShrink: 0 }}>✦</span>
                      <div>
                        <div style={{ color: C.text, fontWeight: 700 }}>{o.t}</div>
                        <div style={{ color: C.muted, lineHeight: 1.4 }}>{o.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <InsightBox color={C.warn} icon="💡">
                La bioeconomía basada en conocimiento podría multiplicarse <strong>10X → USD 100-140B anuales para 2032</strong> si Colombia cierra la brecha de inversión en I+D y acceso a capital de riesgo.
              </InsightBox>
            </Card>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
            Fuentes: <span style={{ color: C.primary }}>Informe DeepTech Colombia 2023</span> · <span style={{ color: YC["2024"] }}>Informe Sciencepreneurs 2024</span> · <span style={{ color: YC["2025"] }}>Informe Sciencepreneurs 2025</span>
            <br />Alianza DeepTech Colombia · MenteX · OlarteMoure Abogados
            <br /><span style={{ color: "#2A4A30" }}>* Datos 2023 parcialmente estimados a partir del análisis narrativo del reporte. * Metodologías de medición varían entre reportes.</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted }}>
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
