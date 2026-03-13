import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "./supabase";

/* ═══════════════════════════════════════════════════════════════════════
   MATHS TERMINALE — Plateforme Prof / Élève
   Auth · Cours · Quiz · Exercices · Chat IA · Dépôt de fichiers · Messagerie
   Basé sur maths-et-tiques.fr (Yvan Monka) — 239 vidéos, 62 exercices, 48 quiz
   ═══════════════════════════════════════════════════════════════════════ */

const BASE = "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-terminale";
const T = "https://www.maths-et-tiques.fr/telech/";

// ─── RESSOURCES EXTERNES (autres profs reconnus) ─────────────
const EXT = {
  apmep: { name: "APMEP — Annales officielles", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
  annales2m: { name: "Annales2maths — Exercices par thème", base: "https://www.annales2maths.com", icon: "📝" },
  xymaths: { name: "XYMaths — Exercices corrigés détaillés", base: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques", icon: "🎓" },
  math93: { name: "Math93 — Sujets BAC + DS corrigés", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
  mathovore: { name: "Mathovore — Sujets et corrigés", base: "https://mathovore.fr", icon: "📘" },
};

const CHAPTERS = [
  { id: "suites", title: "Les suites", icon: "∑", color: "#6366f1", theme: "Analyse", metLink: `${BASE}#1`, coursePdf: [`${T}20SuitesTS1.pdf`, `${T}20SuitesTS2.pdf`], courseVideo: "https://youtu.be/MJv7_pkFcdA",
    methodVideos: [
      { cat: "Récurrence", title: "Effectuer une dém. par récurrence", url: "https://youtu.be/udGGlHdSAgc" },
      { cat: "Récurrence", title: "Utiliser le symbole Σ", url: "https://youtu.be/0zspJuzo7L8" },
      { cat: "Récurrence", title: "Dém. expression générale", url: "https://youtu.be/OIUi3MG8efY" },
      { cat: "Récurrence", title: "Dém. monotonie", url: "https://youtu.be/nMnLaE2RAGk" },
      { cat: "Limites de suites", title: "Limite avec opérations", url: "https://youtu.be/v7hD6s3thp8" },
      { cat: "Limites de suites", title: "Forme indéterminée (1)", url: "https://youtu.be/RQhdU7-KLMA" },
      { cat: "Limites de suites", title: "Forme indéterminée (2)", url: "https://youtu.be/wkMleHBnyqU" },
      { cat: "Limites de suites", title: "Forme indéterminée (3)", url: "https://youtu.be/loytWsU4pdQ" },
      { cat: "Limites de suites", title: "Forme indéterminée (4)", url: "https://youtu.be/9fEHRHdbnwQ" },
      { cat: "Comparaison", title: "Théorème de comparaison", url: "https://youtu.be/iQhh46LupN4" },
      { cat: "Comparaison", title: "Théorème d'encadrement", url: "https://youtu.be/OdzYjz_vQbw" },
      { cat: "Convergence", title: "Suite majorée ou minorée", url: "https://youtu.be/F1u_BVwiW8E" },
      { cat: "Convergence", title: "Convergence monotone", url: "https://youtu.be/gO-MQUlBAfo" },
      { cat: "Arithmético-géo", title: "Exprimer en fonction de n", url: "https://youtu.be/6-vFnQ6TghM" },
      { cat: "Arithmético-géo", title: "Sens de variation", url: "https://youtu.be/0CNt_fUuwEY" },
      { cat: "Arithmético-géo", title: "Limite", url: "https://youtu.be/EgYTH79sDfw" },
      { cat: "Suites géométriques", title: "Limite géo (1)", url: "https://youtu.be/F-PGmIK5Ypg" },
      { cat: "Suites géométriques", title: "Limite géo (2)", url: "https://youtu.be/2BueBAoPvvc" },
      { cat: "Suites géométriques", title: "Limite géo (3)", url: "https://youtu.be/XTftGHfnYMw" },
      { cat: "Suites géométriques", title: "Limite somme géo", url: "https://youtu.be/6QjMEzEn5X0" }
    ],
    demoVideos: [
      { title: "Inégalité de Bernoulli", url: "https://youtu.be/H6XJ2tB1_fg" },
      { title: "Divergence suite minorée", url: "https://youtu.be/qIBlhdofYFI" },
      { title: "Suite croissante non majorée → +∞", url: "https://youtu.be/rttQIYOKCRQ" },
      { title: "Limite de qⁿ", url: "https://youtu.be/aSBGk_GEEew" }
    ],
    exerciseVideos: [
      { title: "Somme suite arithmétique", url: "https://youtu.be/CDMol9f8vgc" },
      { title: "Dém. par récurrence", url: "https://youtu.be/LXSJB0BnPD4" },
      { title: "BAC Suites", url: "https://youtu.be/Iq0I4L_OX2s" },
      { title: "BAC Suites, pourcentages, algo", url: "https://youtu.be/d4ZLf-GqTVo" },
      { title: "BAC Suites, logarithme", url: "https://youtu.be/ZgEpJipajzc" }
    ],
    sections: ["Raisonnement par récurrence", "Limites de suites", "Comparaison et encadrement", "Convergence monotone", "Suites arithmético-géométriques", "Suites géométriques"],
    extraLinks: [
      { name: "XYMaths — Annales BAC Suites", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/suites.php", icon: "🎓" },
      { name: "Annales2maths — Exercices Suites", url: "https://www.annales2maths.com/exercices-ts/", icon: "📝" },
      { name: "APMEP — Tous les sujets BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
      { name: "Mathovore — Suites BAC corrigés", url: "https://mathovore.fr/les-suites-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
    ],
    keyFormulas: [{ name: "Arithmétique", formula: "uₙ = u₀ + nr" }, { name: "Géométrique", formula: "uₙ = u₀qⁿ" }, { name: "Somme arith.", formula: "n(u₁+uₙ)/2" }, { name: "Somme géo.", formula: "u₀(1−qⁿ)/(1−q)" }],
    quiz: [
      { q: "uₙ₊₁=uₙ+3, u₀=2. Nature ?", choices: ["Arithmétique r=3", "Géométrique q=3", "Ni l'un ni l'autre", "Arithmétique r=2"], answer: 0, explanation: "uₙ₊₁=uₙ+3 → arithmétique de raison 3." },
      { q: "uₙ=(−1)ⁿ converge ?", choices: ["Non, diverge", "Oui vers 0", "Oui vers 1", "Oui vers −1"], answer: 0, explanation: "Alterne entre −1 et 1, pas de limite." },
      { q: "uₙ=5×2ⁿ, limite ?", choices: ["+∞", "0", "5", "2"], answer: 0, explanation: "q=2>1 → diverge vers +∞." },
      { q: "Prouver ∀n≥0, on utilise :", choices: ["Récurrence", "Limite", "Dérivation", "Tableau de signes"], answer: 0, explanation: "Récurrence pour prouver ∀n≥n₀." },
      { q: "1+2+...+100 = ?", choices: ["5050", "5000", "10000", "10100"], answer: 0, explanation: "100×101/2 = 5050." },
      { q: "Suite croissante et majorée →", choices: ["Converge", "Diverge vers +∞", "On ne sait pas", "Oscille"], answer: 0, explanation: "Théorème de convergence monotone." }
    ],
    exercises: [
      { title: "Récurrence", statement: "Montrer par récurrence : 1+2+...+n = n(n+1)/2.", hint: "Init n=1. Hérédité : supposez P(k).", solution: "Init: 1=1×2/2 ✓. Si Σk=k(k+1)/2 alors Σ(k+1)=(k+1)(k+2)/2 ✓." },
      { title: "Convergence", statement: "uₙ=(3n+1)/(n+2). Limite ?", hint: "Factorisez par n.", solution: "(3+1/n)/(1+2/n)→3." },
      { title: "Arithmético-géo", statement: "uₙ₊₁=0.5uₙ+3, u₀=10. Limite ℓ, poser vₙ=uₙ−ℓ.", hint: "ℓ=0.5ℓ+3→ℓ=6. vₙ géométrique.", solution: "ℓ=6. vₙ=uₙ−6, vₙ₊₁=0.5vₙ. vₙ=4×0.5ⁿ→0. uₙ→6." },
      { title: "Somme géo", statement: "Calculer S=1+2+4+...+2⁹.", hint: "Suite géo u₀=1, q=2, 10 termes.", solution: "S=1×(1−2¹⁰)/(1−2)=1023." },
      { title: "Récurrence inégalité", statement: "Montrer ∀n≥1 : 2ⁿ≥n+1.", hint: "Init n=1: 2≥2 ✓. Hérédité: 2ᵏ⁺¹=2×2ᵏ≥2(k+1).", solution: "2(k+1)=2k+2≥k+2=(k+1)+1 car k≥1. ✓" },
      { title: "Encadrement", statement: "uₙ=sin(n)/n. Limite ?", hint: "−1≤sin(n)≤1 donc −1/n≤uₙ≤1/n.", solution: "Par encadrement (gendarmes), comme ±1/n→0, uₙ→0." }
    ]
  },
  { id: "limites", title: "Limites de fonctions", icon: "→", color: "#8b5cf6", theme: "Analyse", metLink: `${BASE}#2`, coursePdf: [`${T}20LimitesFct1.pdf`, `${T}20LimitesFct2.pdf`], courseVideo: "https://youtu.be/YPwJyYDsmxM",
    methodVideos: [
      { cat: "Limites", title: "Limites graphiquement", url: "https://youtu.be/9nEJCL3s2eU" },
      { cat: "Limites", title: "Tracer courbe depuis tableau", url: "https://youtu.be/vkfpsiqMydY" },
      { cat: "Limites", title: "Limite avec opérations", url: "https://youtu.be/at6pFx-Umfs" },
      { cat: "Formes indéterminées", title: "FI (1)", url: "https://youtu.be/4NQbGdXThrk" },
      { cat: "Formes indéterminées", title: "FI (2)", url: "https://youtu.be/8tAVa4itblc" },
      { cat: "Formes indéterminées", title: "FI (3)", url: "https://youtu.be/pmWPfsQaRWI" },
      { cat: "Formes indéterminées", title: "FI (4)", url: "https://youtu.be/n3XapvUfXJQ" },
      { cat: "Formes indéterminées", title: "FI (5)", url: "https://youtu.be/y7Sbqkb9RoU" },
      { cat: "Asymptotes", title: "Asymptote horizontale", url: "https://youtu.be/0LDGK-QkL80" },
      { cat: "Asymptotes", title: "Asymptote verticale", url: "https://youtu.be/pXDhrx-nMto" },
      { cat: "Asymptotes", title: "Asymptote oblique", url: "https://youtu.be/zbyGXpKTI_k" },
      { cat: "Composées", title: "Limite composée", url: "https://youtu.be/DNU1M3Ii76k" },
      { cat: "Composées", title: "Limite composée (expo)", url: "https://youtu.be/f5i_u8XVMfc" },
      { cat: "Comparaison", title: "Théorème comparaison", url: "https://youtu.be/OAtkpYMdu7Y" },
      { cat: "Comparaison", title: "Théorème encadrement", url: "https://youtu.be/Eo1jvPphja0" },
      { cat: "Comparaison", title: "Croissance comparée exp/xⁿ", url: "https://youtu.be/GoLYLTZFaz0" }
    ],
    demoVideos: [{ title: "Limites en ±∞ de exp", url: "https://youtu.be/DDqgEz1Id2s" }, { title: "Croissance comparée xⁿ et exp", url: "https://youtu.be/_re6fVWD4b0" }],
    exerciseVideos: [],
        extraLinks: [
      { name: "XYMaths — Annales BAC Limites", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/limites.php", icon: "🎓" },
      { name: "Annales2maths — Sujets BAC corrigés", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "📝" },
      { name: "Math93 — Sujets BAC 2024-2025", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Limites en l'infini", "Limites en un point", "Asymptotes H/V/obliques", "Opérations sur les limites", "Formes indéterminées", "Fonctions composées", "Comparaison et encadrement", "Croissances comparées"],
    keyFormulas: [{ name: "Croissances", formula: "eˣ >> xⁿ >> ln(x)" }, { name: "AH", formula: "lim=ℓ → y=ℓ" }, { name: "AV", formula: "lim=±∞ → x=a" }],
    quiz: [
      { q: "lim(x→+∞) (2x²−3x)/(x²+1) ?", choices: ["2", "+∞", "0", "−3"], answer: 0, explanation: "Factoriser par x²: → 2." },
      { q: "lim(x→+∞) ln(x)/x ?", choices: ["0", "1", "+∞", "ln(1)"], answer: 0, explanation: "Croissance comparée." },
      { q: "lim(x→2⁺) f(x)=+∞ →", choices: ["AV x=2", "AH y=2", "f(2)=+∞", "Continue en 2"], answer: 0, explanation: "Asymptote verticale x=2." },
      { q: "eˣ−x quand x→+∞ : FI ?", choices: ["+∞−∞ (oui)", "+∞ directement", "0", "−∞"], answer: 0, explanation: "FI +∞−∞, mais eˣ domine → +∞." }
    ],
    exercises: [
      { title: "Limites et asymptotes", statement: "f(x)=(x²+1)/(x−1). Limites et asymptotes.", hint: "Division euclidienne.", solution: "f(x)=x+1+2/(x−1). AO y=x+1, AV x=1." },
      { title: "Forme indéterminée", statement: "lim(x→+∞) √(x²+x)−x.", hint: "Expression conjuguée.", solution: "=x/(√(x²+x)+x)→1/2." },
      { title: "Croissance comparée", statement: "lim(x→+∞) (x²−1)eˣ.", hint: "eˣ domine tout polynôme.", solution: "x²eˣ−eˣ→+∞ car eˣ domine." },
      { title: "Asymptote verticale", statement: "f(x)=1/(x²−4). Asymptotes verticales ?", hint: "Dénominateur nul en ±2.", solution: "AV x=2 et x=−2. lim(2⁺)=+∞, lim(2⁻)=−∞." },
      { title: "Théorème des gendarmes", statement: "lim(x→+∞) cos(x)/x.", hint: "−1≤cos(x)≤1.", solution: "−1/x≤cos(x)/x≤1/x. Gendarmes: →0." }
    ]
  },
  { id: "derivation", title: "Dérivation", icon: "f'", color: "#a855f7", theme: "Analyse", metLink: `${BASE}#3`, coursePdf: [`${T}20DerivT.pdf`], courseVideo: "https://youtu.be/XAgdHblbajE",
    methodVideos: [
      { cat: "Composées", title: "Identifier la composée", url: "https://youtu.be/08HgDgD6XL8" },
      { cat: "Composées", title: "Composer deux fonctions", url: "https://youtu.be/sZ2zqEz4hug" },
      { cat: "Composées", title: "Dérivée composée (1)", url: "https://youtu.be/lwcFgnbs0Ew" },
      { cat: "Composées", title: "Dérivée composée (2)", url: "https://youtu.be/kE32Ek8BXvs" },
      { cat: "Composées", title: "Dérivée composée (3)", url: "https://youtu.be/5G4Aa8gKH_o" },
      { cat: "Étude complète", title: "1/6 Ensemble de définition", url: "https://youtu.be/0MwFVTHZdpo" },
      { cat: "Étude complète", title: "2/6 Limites", url: "https://youtu.be/j-pKLxjHNJw" },
      { cat: "Étude complète", title: "3/6 Dérivabilité", url: "https://youtu.be/7c7HeV8cMvo" },
      { cat: "Étude complète", title: "4/6 Variations", url: "https://youtu.be/95eLAWaSwwc" },
      { cat: "Étude complète", title: "5/6 Asymptotes", url: "https://youtu.be/a1Z29PuSQ64" },
      { cat: "Étude complète", title: "6/6 Représentation", url: "https://youtu.be/mM24gzGuWcA" }
    ],
    demoVideos: [],
    exerciseVideos: [
      { title: "Position relative exp et y=x", url: "https://youtu.be/RA4ygCl3ViE" },
      { title: "Tangente horizontale", url: "https://youtu.be/9tWt9x4P3t0" },
      { title: "Fonction exp 1/3 Limites", url: "https://youtu.be/I4HkvkpqjNw" },
      { title: "Fonction exp 2/3 Variations", url: "https://youtu.be/Vx0H1DV3Yqc" },
      { title: "Fonction exp 3/3 Repr.", url: "https://youtu.be/2RIBQ1LiNYU" },
      { title: "BAC Expo convexité intégration", url: "https://youtu.be/cdUQhZtDAlE" },
      { title: "BAC Expo dérivation convexité", url: "https://youtu.be/fTLVwAIHawg" }
    ],
        extraLinks: [
      { name: "XYMaths — Exercices Dérivation", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/derivation/", icon: "🎓" },
      { name: "Annales2maths — Sujets BAC", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "📝" },
    ],
    sections: ["Dérivées des composées", "Dérivée eᵘ, ln(u), uⁿ", "Étude complète", "Tableau de variation", "Extremums", "Tangente"],
    keyFormulas: [{ name: "Chaîne", formula: "(f∘g)'=g'×f'(g)" }, { name: "(eᵘ)'", formula: "u'eᵘ" }, { name: "(ln u)'", formula: "u'/u" }, { name: "(uⁿ)'", formula: "nu'uⁿ⁻¹" }],
    quiz: [
      { q: "Dérivée de e^(2x+1) ?", choices: ["2e^(2x+1)", "e^(2x+1)", "(2x+1)e^(2x)", "2xe^(2x+1)"], answer: 0, explanation: "u'eᵘ = 2e^(2x+1)." },
      { q: "Dérivée de ln(x²+1) ?", choices: ["2x/(x²+1)", "1/(x²+1)", "2x·ln(x²+1)", "1/(2x)"], answer: 0, explanation: "u'/u = 2x/(x²+1)." },
      { q: "Dérivée de (3x−1)⁵ ?", choices: ["15(3x−1)⁴", "5(3x−1)⁴", "(3x−1)⁴", "15(3x)⁴"], answer: 0, explanation: "5×3×(3x−1)⁴ = 15(3x−1)⁴." },
      { q: "f'(x₀)=0 et f' change de signe →", choices: ["Extremum local", "f constante", "f non définie", "f croissante"], answer: 0, explanation: "Extremum local en x₀." }
    ],
    exercises: [
      { title: "Étude complète", statement: "f(x)=xe⁻ˣ. Variations sur ℝ.", hint: "(uv)'=u'v+uv'.", solution: "f'=(1−x)e⁻ˣ. Max f(1)=1/e." },
      { title: "Tangente", statement: "Tangente à f(x)=ln(x) en x=e.", hint: "T: y=f'(a)(x−a)+f(a).", solution: "f(e)=1, f'(e)=1/e. T: y=x/e." },
      { title: "Composée", statement: "Dériver f(x)=e^(x²−3x+1).", hint: "f=eᵘ, u=x²−3x+1.", solution: "f'=(2x−3)e^(x²−3x+1)." },
      { title: "Extremum", statement: "f(x)=(x−1)/(x²+1). Extremums ?", hint: "f'=(u'v−uv')/v². Résoudre f'=0.", solution: "f'=(−x²+2x+1)/(x²+1)². f'=0: x=1±√2. Max en 1+√2, min en 1−√2." },
      { title: "Tangente horizontale", statement: "f(x)=x³−3x+1. Points à tangente horizontale.", hint: "f'(x)=0.", solution: "f'=3x²−3=0→x=±1. Points (1,−1) et (−1,3)." }
    ]
  },
  { id: "continuite", title: "Continuité", icon: "↔", color: "#c084fc", theme: "Analyse", metLink: `${BASE}#4`, coursePdf: [`${T}20Cont.pdf`], courseVideo: "https://youtu.be/9SSEUoyHh2s",
    methodVideos: [
      { cat: "Continuité", title: "Continuité graphiquement", url: "https://youtu.be/XpjKserte6o" },
      { cat: "Continuité", title: "Étudier la continuité", url: "https://youtu.be/03WMLyc7rLE" },
      { cat: "TVI", title: "TVI (1)", url: "https://youtu.be/fkd7c3IAc3Y" },
      { cat: "TVI", title: "TVI (2)", url: "https://youtu.be/UmGQf7gkvLg" },
      { cat: "Algo", title: "Dichotomie", url: "https://youtu.be/V7mlMCSrq1U" },
      { cat: "Suites et fonctions", title: "Suite récurrente (1)", url: "https://youtu.be/L7bBL4z-r90" },
      { cat: "Suites et fonctions", title: "Suite récurrente (2)", url: "https://youtu.be/LDRx7aS9JsA" },
      { cat: "Suites et fonctions", title: "Variation avec fonction", url: "https://youtu.be/dPR3GyQycH0" }
    ],
    demoVideos: [], exerciseVideos: [{ title: "BAC Limite dérivée continuité convexité suites", url: "https://youtu.be/mmHtILuE5mU" }],
        extraLinks: [
      { name: "XYMaths — Annales BAC Continuité", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/continuite-tvi.php", icon: "🎓" },
      { name: "APMEP — Annales Terminale", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
    ],
    sections: ["Définition continuité", "Continuité sur un intervalle", "TVI", "Existence de solutions", "Dichotomie", "Suites et fonctions"],
    keyFormulas: [{ name: "Continue en a", formula: "lim f(x)=f(a)" }, { name: "TVI", formula: "f continue, k entre f(a) et f(b) ⇒ ∃c" }],
    quiz: [
      { q: "Le TVI sert à :", choices: ["Prouver existence solution", "Calculer dérivée", "Trouver limite", "Calculer intégrale"], answer: 0, explanation: "TVI ⇒ existence." },
      { q: "f continue [0,1], f(0)=−2, f(1)=3 →", choices: ["f s'annule (TVI)", "Pas assez d'info", "Si dérivable seulement", "Par la dérivée"], answer: 0, explanation: "0 entre f(0) et f(1), f continue ⇒ TVI." }
    ],
    exercises: [
      { title: "TVI", statement: "Montrer eˣ=x+2 a une solution sur [0,2].", hint: "g(x)=eˣ−x−2.", solution: "g(0)=−1<0, g(2)≈3.39>0. TVI ⇒ ∃c." },
      { title: "TVI bis", statement: "f(x)=x³+x−1. Montrer f s'annule exactement une fois sur [0,1].", hint: "f continue, f(0)=−1, f(1)=1. Et f strictement croissante.", solution: "f(0)<0<f(1), TVI ⇒ ∃c. f'=3x²+1>0 ⇒ f strictement croissante ⇒ unicité." },
      { title: "Dichotomie", statement: "f(x)=x³−2. Encadrer √³2 à 0.5 près.", hint: "f(1)=−1<0, f(2)=6>0. Milieu m=1.5.", solution: "f(1.5)=1.375>0→c∈[1,1.5]. f(1.25)≈−0.05<0→c∈[1.25,1.5]. √³2≈1.26." }
    ]
  },
  { id: "convexite", title: "Convexité", icon: "∪", color: "#e879f9", theme: "Analyse", metLink: `${BASE}#5`, coursePdf: [`${T}20ConvexiteT.pdf`], courseVideo: "https://youtu.be/gge4xdn6cFA",
    methodVideos: [
      { cat: "Convexité", title: "Dérivée seconde", url: "https://youtu.be/W6rypabq8uA" },
      { cat: "Convexité", title: "Convexité graphiquement", url: "https://youtu.be/ERML85y_s6E" },
      { cat: "Convexité", title: "Étudier la convexité", url: "https://youtu.be/8H2aYKN8NGE" },
      { cat: "Convexité", title: "Point d'inflexion", url: "https://youtu.be/r8sYr6ToeLo" },
      { cat: "Convexité", title: "Résoudre un problème", url: "https://youtu.be/_XlgCeLcN1k" },
      { cat: "Convexité", title: "Prouver inégalité", url: "https://youtu.be/AaxQHlsxZkg" }
    ],
    demoVideos: [{ title: "f convexe si f' croissante", url: "https://youtu.be/-OG8l5Batuo" }],
    exerciseVideos: [{ title: "Convexité d'une fonction", url: "https://youtu.be/ji-0MWrZl_c" }, { title: "Fonction exponentielle", url: "https://youtu.be/Q4cqUJrTPZo" }, { title: "BAC convexité suites", url: "https://youtu.be/mmHtILuE5mU" }, { title: "BAC log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "XYMaths — Exercices Convexité", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/convexite/", icon: "🎓" },
      { name: "Annales2maths — BAC Convexité", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "📝" },
    ],
    sections: ["Convexe/concave", "f'' et convexité", "Point d'inflexion", "Courbe/tangentes", "Inégalités"],
    keyFormulas: [{ name: "Convexe", formula: "f''≥0" }, { name: "Concave", formula: "f''≤0" }, { name: "Inflexion", formula: "f'' change de signe" }],
    quiz: [
      { q: "f''>0 partout →", choices: ["Convexe", "Concave", "Décroissante", "Constante"], answer: 0, explanation: "f''>0 ⇒ convexe." },
      { q: "Point d'inflexion = f''", choices: ["Change de signe", "S'annule seulement", "Maximum", "Minimum"], answer: 0, explanation: "Changement de convexité." },
      { q: "f convexe ⇒ courbe", choices: ["Au-dessus tangentes", "En-dessous tangentes", "Décroissante", "Croissante"], answer: 0, explanation: "Propriété fondamentale." }
    ],
    exercises: [
      { title: "Convexité", statement: "f(x)=x³−3x. Convexité et inflexion.", hint: "f''=6x.", solution: "f''=0⟺x=0. Concave x<0, convexe x>0. Inflexion (0,0)." },
      { title: "Tangente et convexité", statement: "f(x)=eˣ. Montrer que eˣ≥x+1 pour tout x.", hint: "T en 0 : y=x+1. f convexe⇒courbe au-dessus.", solution: "f''=eˣ>0: convexe. T₀: y=x+1. Convexe⇒eˣ≥x+1. ✓" },
      { title: "Point d'inflexion", statement: "f(x)=x⁴−6x². Points d'inflexion ?", hint: "f''=12x²−12=12(x²−1).", solution: "f''=0: x=±1. f'' change de signe en ±1. Inflexion (1,−5) et (−1,−5)." }
    ]
  },
  { id: "logarithme", title: "Logarithme népérien", icon: "ln", color: "#f43f5e", theme: "Analyse", metLink: `${BASE}#6`, coursePdf: [`${T}20LogT1.pdf`, `${T}20LogT2.pdf`], courseVideo: "https://youtu.be/VJns0RfVWGg",
    methodVideos: [
      { cat: "Propriétés", title: "Formules logarithmes", url: "https://youtu.be/HGrK77-SCl4" },
      { cat: "Équations", title: "Équation ln (1)", url: "https://youtu.be/lCT-8ijhZiE" },
      { cat: "Équations", title: "Équation ln (2)", url: "https://youtu.be/GDt785E8TPE" },
      { cat: "Équations", title: "Résoudre avec ln", url: "https://youtu.be/RzX506TFBIA" },
      { cat: "Équations", title: "Inéquation ln", url: "https://youtu.be/_fpPphstjYw" },
      { cat: "Dérivation", title: "Dériver avec ln", url: "https://youtu.be/yiQ4Z5FdFQ8" },
      { cat: "Dérivation", title: "Dériver ln(u)", url: "https://youtu.be/-zrhBc9xdRs" },
      { cat: "Limites", title: "Croissance comparée (1)", url: "https://youtu.be/lA3W_j4p-c8" },
      { cat: "Limites", title: "Croissance comparée (2)", url: "https://youtu.be/OYcsChr8src" },
      { cat: "Étude", title: "Étudier f avec ln", url: "https://youtu.be/iT9C0BiOK4Y" },
      { cat: "Étude", title: "Position relative ln et y=x", url: "https://youtu.be/0hQnOs_hcss" },
      { cat: "Étude ln(u)", title: "ln(u) 1/3 Limites", url: "https://youtu.be/s9vyHsZoV-4" },
      { cat: "Étude ln(u)", title: "ln(u) 2/3 Variations", url: "https://youtu.be/3eI4-JRKYVo" },
      { cat: "Étude ln(u)", title: "ln(u) 3/3 Repr.", url: "https://youtu.be/CyOC-E7MnUw" }
    ],
    demoVideos: [{ title: "Dérivée de ln", url: "https://youtu.be/wmysrEq4XIg" }, { title: "Limite x·ln(x) en 0", url: "https://youtu.be/LxgQBYTaRaw" }],
    exerciseVideos: [{ title: "BAC Logarithme dérivation", url: "https://youtu.be/GmIueQ7MehA" }, { title: "BAC log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "XYMaths — Annales BAC Logarithme", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/logarithme.php", icon: "🎓" },
      { name: "Mathovore — Logarithme corrigés", url: "https://mathovore.fr/le-logarithme-neperien-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — DS corrigés", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Définition ln", "Propriétés algébriques", "Dérivée ln et ln(u)", "Équations/inéquations", "Croissances comparées"],
    keyFormulas: [{ name: "Définition", formula: "y=ln(x) ⟺ x=eʸ" }, { name: "Produit", formula: "ln(ab)=ln a+ln b" }, { name: "Puissance", formula: "ln(aⁿ)=n·ln a" }, { name: "Dérivée", formula: "(ln x)'=1/x" }],
    quiz: [
      { q: "ln(1)=?", choices: ["0", "1", "e", "−1"], answer: 0, explanation: "e⁰=1." },
      { q: "ln(e³)=?", choices: ["3", "e³", "3e", "ln3"], answer: 0, explanation: "ln(eˣ)=x." },
      { q: "Domaine ln(2x−1):", choices: ["]1/2,+∞[", "ℝ", "]0,+∞[", "[1/2,+∞["], answer: 0, explanation: "2x−1>0⟺x>1/2." },
      { q: "lim(x→0⁺) ln(x)=?", choices: ["−∞", "0", "+∞", "1"], answer: 0, explanation: "ln tend vers −∞ en 0⁺." }
    ],
    exercises: [
      { title: "Équation", statement: "Résoudre ln(x)+ln(x−1)=ln(2).", hint: "ln(ab)=ln(a)+ln(b).", solution: "ln(x(x−1))=ln(2)→x²−x−2=0→x=2." },
      { title: "Étude", statement: "f(x)=ln(x)/x. Variations et limite.", hint: "f'=(1−ln x)/x².", solution: "f'=0⟺x=e. Max f(e)=1/e. lim(+∞)=0." },
      { title: "Inéquation", statement: "Résoudre ln(x−1)>ln(3).", hint: "ln strictement croissante.", solution: "x−1>3 ⟺ x>4. Avec x>1 (domaine): S=]4,+∞[." },
      { title: "Croissance comparée", statement: "lim(x→+∞) (ln x)²/x.", hint: "Posez X=ln x → x=eˣ.", solution: "=(ln x)²/x. Croissance comparée: ln(x) << x^(1/2) ⇒ (ln x)²<< x ⇒ →0." }
    ]
  },
  { id: "trigo", title: "Fonctions trigonométriques", icon: "π", color: "#06b6d4", theme: "Analyse", metLink: `${BASE}#7`, coursePdf: [`${T}20TrigoT.pdf`], courseVideo: "https://youtu.be/wJjb3CSS3cg",
    methodVideos: [
      { cat: "Équations", title: "Éq. trigo (1)", url: "https://youtu.be/p6U55YsS440" },
      { cat: "Équations", title: "Éq. trigo (2)", url: "https://youtu.be/PcgvyxU5FCc" },
      { cat: "Équations", title: "Inéq. trigo", url: "https://youtu.be/raU77Qb_-Iw" },
      { cat: "Parité/Périodicité", title: "Graphiquement", url: "https://youtu.be/RV3Bi06nQOs" },
      { cat: "Parité/Périodicité", title: "Étudier parité", url: "https://youtu.be/hrbgxnCZW_I" },
      { cat: "Parité/Périodicité", title: "Compléter graphique", url: "https://youtu.be/KbCpqXSvR8M" },
      { cat: "Étude complète", title: "1/4 Parité", url: "https://youtu.be/uOXv5XnAiNk" },
      { cat: "Étude complète", title: "2/4 Périodicité", url: "https://youtu.be/s3S85RL06ks" },
      { cat: "Étude complète", title: "3/4 Variations", url: "https://youtu.be/X6vJog_xQRY" },
      { cat: "Étude complète", title: "4/4 Représentation", url: "https://youtu.be/ol6UtCpFDQM" }
    ],
    demoVideos: [], exerciseVideos: [],
        extraLinks: [
      { name: "XYMaths — Exercices Trigo", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/trigonometrie/", icon: "🎓" },
      { name: "APMEP — Annales BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
    ],
    sections: ["sin/cos dérivées", "Parité/périodicité", "Formules d'addition", "Formules duplication", "Éq./inéq. trigo"],
    keyFormulas: [{ name: "cos(a+b)", formula: "cos a cos b−sin a sin b" }, { name: "sin(a+b)", formula: "sin a cos b+cos a sin b" }, { name: "cos(2a)", formula: "2cos²a−1" }, { name: "(sin)'", formula: "cos x" }, { name: "(cos)'", formula: "−sin x" }],
    quiz: [
      { q: "cos(π/3)=?", choices: ["1/2", "√3/2", "0", "√2/2"], answer: 0, explanation: "cos(60°)=1/2." },
      { q: "(sin x)'=?", choices: ["cos x", "−cos x", "sin x", "−sin x"], answer: 0, explanation: "Dérivée classique." },
      { q: "cos²x+sin²x=?", choices: ["1", "0", "2", "cos(2x)"], answer: 0, explanation: "Identité fondamentale." }
    ],
    exercises: [
      { title: "Éq. trigo", statement: "cos(2x)=cos(x) sur [0,2π].", hint: "cos A=cos B ⟺ A=±B+2kπ.", solution: "x∈{0,2π/3,4π/3,2π}." },
      { title: "Étude trigo", statement: "f(x)=2sin(x)+sin(2x). f'(x) ?", hint: "f'=2cos x+2cos(2x).", solution: "f'=2cos x+2(2cos²x−1)=4cos²x+2cos x−2." },
      { title: "Formule duplication", statement: "Simplifier cos²(x)−sin²(x).", hint: "Formule de cos(2x).", solution: "cos²x−sin²x=cos(2x)." },
      { title: "Inéquation", statement: "sin(x)≥1/2 sur [0,2π].", hint: "Quand sin(x)=1/2 sur le cercle?", solution: "sin(x)≥1/2 ⟺ x∈[π/6, 5π/6]." }
    ]
  },
  { id: "primitives", title: "Primitives & Éq. diff.", icon: "∫'", color: "#fb923c", theme: "Analyse", metLink: `${BASE}#8`, coursePdf: [`${T}20Prim-EdT.pdf`], courseVideo: "https://youtu.be/bQ-eS1zZCdw",
    methodVideos: [
      { cat: "Primitives", title: "Vérifier primitive", url: "https://youtu.be/7tQqY9Vkmss" },
      { cat: "Primitives", title: "Calculer LA primitive", url: "https://youtu.be/-q9M7oJ9gkI" },
      { cat: "Primitives", title: "Primitive (1)", url: "https://youtu.be/GA6jMgLd_Cw" },
      { cat: "Primitives", title: "Primitive (2)", url: "https://youtu.be/82HYI4xuClw" },
      { cat: "Primitives", title: "Primitive (3)", url: "https://youtu.be/gxRpmHWnoGQ" },
      { cat: "Primitives", title: "Primitive (4)", url: "https://youtu.be/iiq6eUQee9g" },
      { cat: "Éq. diff.", title: "Vérifier solution", url: "https://youtu.be/LX8PxR-ScfM" },
      { cat: "Éq. diff.", title: "y'=ay", url: "https://youtu.be/YJNHTq85tJA" },
      { cat: "Éq. diff.", title: "y'=ay+b (1)", url: "https://youtu.be/F_LQLZ8rUhg" },
      { cat: "Éq. diff.", title: "y'=ay+b (2)", url: "https://youtu.be/CFZr44vny3w" },
      { cat: "Éq. diff.", title: "y'=ay+f", url: "https://youtu.be/QeGvVncvyLc" },
      { cat: "Éq. diff.", title: "Cours éq. diff. vidéo", url: "https://youtu.be/qHF5kiDFkW8" }
    ],
    demoVideos: [{ title: "Deux primitives diffèrent d'une cte", url: "https://youtu.be/oloWk2F4bI8" }, { title: "Solutions de y'=ay", url: "https://youtu.be/FQlxi8JKmg4" }],
    exerciseVideos: [{ title: "BAC Éq. diff, expo, suites", url: "https://youtu.be/VMRsAkKAVZo" }],
        extraLinks: [
      { name: "XYMaths — Annales Primitives/Intégrales", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/primitives-integrales.php", icon: "🎓" },
      { name: "Annales2maths — BAC corrigés", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "📝" },
    ],
    sections: ["Primitives usuelles", "Condition initiale", "y'=ay", "y'=ay+b", "Modélisation"],
    keyFormulas: [{ name: "Prim. xⁿ", formula: "xⁿ⁺¹/(n+1)+C" }, { name: "Prim. eˣ", formula: "eˣ+C" }, { name: "y'=ay", formula: "y=Ceᵃˣ" }, { name: "y'=ay+b", formula: "y=Ceᵃˣ−b/a" }],
    quiz: [
      { q: "Primitive de 3x²:", choices: ["x³+C", "6x+C", "x³", "3x³+C"], answer: 0, explanation: "3x²→x³+C." },
      { q: "y'=2y →", choices: ["y=Ce²ˣ", "y=2x+C", "y=e²ˣ", "y=C·2x"], answer: 0, explanation: "y=Ce^(ax)." },
      { q: "y'=−y, y(0)=5 →", choices: ["5e⁻ˣ", "−5eˣ", "5eˣ", "e⁻⁵ˣ"], answer: 0, explanation: "C=5→y=5e⁻ˣ." }
    ],
    exercises: [
      { title: "Éq. diff.", statement: "y'=−3y+6, y(0)=1.", hint: "y=Ce⁻³ˣ+2.", solution: "C+2=1→C=−1. y=−e⁻³ˣ+2." },
      { title: "Primitives", statement: "Trouver F primitive de f(x)=2x·eˣ² telle que F(0)=3.", hint: "Remarquer que (eˣ²)'=2xeˣ².", solution: "F(x)=eˣ²+C. F(0)=1+C=3→C=2. F(x)=eˣ²+2." },
      { title: "Modélisation", statement: "Population P vérifie P'=0.02P, P(0)=1000. P(t)?", hint: "y'=ay avec a=0.02.", solution: "P(t)=1000e^(0.02t)." },
      { title: "Éq. diff. 2", statement: "y'=2y−4, y(0)=5.", hint: "Sol. gén: y=Ce²ˣ+2.", solution: "y(0)=C+2=5→C=3. y=3e²ˣ+2." }
    ]
  },
  { id: "integration", title: "Calcul intégral", icon: "∫", color: "#ef4444", theme: "Analyse", metLink: `${BASE}#9`, coursePdf: [`${T}20IntegT1.pdf`, `${T}20IntegT2.pdf`], courseVideo: "https://youtu.be/pFKzXZrMVxs",
    methodVideos: [
      { cat: "Calcul", title: "Aire (1)", url: "https://youtu.be/jkxNKkmEXZA" },
      { cat: "Calcul", title: "Aire (2)", url: "https://youtu.be/l2zuaZukc0g" },
      { cat: "Calcul", title: "Fonction définie par intégrale", url: "https://youtu.be/6DHXw5TRzN4" },
      { cat: "Calcul", title: "Intégrale (1)", url: "https://youtu.be/Z3vKJJE57Uw" },
      { cat: "Calcul", title: "Intégrale (2)", url: "https://youtu.be/8ci1RrNH1L0" },
      { cat: "Calcul", title: "Intégrale (3)", url: "https://youtu.be/uVMRZSmYcQE" },
      { cat: "Calcul", title: "Linéarité", url: "https://youtu.be/B9n_AArwjKw" },
      { cat: "Calcul", title: "Encadrer intégrale", url: "https://youtu.be/VK0PvzWBIso" },
      { cat: "Applications", title: "Aire entre courbes", url: "https://youtu.be/oRSAYNwUiHQ" },
      { cat: "Applications", title: "Valeur moyenne", url: "https://youtu.be/oVFHojz5y50" },
      { cat: "Par parties", title: "IPP (1)", url: "https://youtu.be/uNIpYeaNfsg" },
      { cat: "Par parties", title: "IPP (2)", url: "https://youtu.be/vNQeSEb2mj8" },
      { cat: "Par parties", title: "IPP (3)", url: "https://youtu.be/xbb3vnzF3EA" },
      { cat: "Suites", title: "Suite d'intégrales", url: "https://youtu.be/8I0jA4lClKM" }
    ],
    demoVideos: [{ title: "F(x)=∫f(t)dt est primitive", url: "https://youtu.be/p2W6FYBxTlo" }, { title: "∫f=F(b)−F(a)", url: "https://youtu.be/S3reCPS4dq4" }, { title: "Formule IPP", url: "https://youtu.be/v3TdIdu0sgk" }],
    exerciseVideos: [{ title: "BAC Expo intégration algo", url: "https://youtu.be/JpdTZYEJBpA" }, { title: "BAC Expo dérivation intégration", url: "https://youtu.be/vaRkqrCCWPY" }, { title: "BAC Log dérivation intégration", url: "https://youtu.be/akJabWOn3jU" }, { title: "BAC Log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "XYMaths — Annales BAC Intégration", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/primitives-integrales.php", icon: "🎓" },
      { name: "Mathovore — Intégrales corrigés", url: "https://mathovore.fr/les-integrales-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — Sujets BAC", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Intégrale et aire", "Propriétés", "Calcul avec primitives", "Encadrement", "Aire entre courbes", "Valeur moyenne", "IPP"],
    keyFormulas: [{ name: "Fondamental", formula: "∫ₐᵇf=F(b)−F(a)" }, { name: "IPP", formula: "∫uv'=[uv]−∫u'v" }, { name: "Val. moyenne", formula: "(1/(b−a))∫ₐᵇf" }],
    quiz: [
      { q: "∫₀¹ 2x dx=?", choices: ["1", "2", "0", "1/2"], answer: 0, explanation: "[x²]₀¹=1." },
      { q: "∫₁ᵉ 1/x dx=?", choices: ["1", "e", "0", "e−1"], answer: 0, explanation: "[ln x]₁ᵉ=1." },
      { q: "Valeur moyenne de f sur [a,b]:", choices: ["∫f/(b−a)", "∫f", "f((a+b)/2)", "(f(a)+f(b))/2"], answer: 0, explanation: "Définition." }
    ],
    exercises: [
      { title: "Aire", statement: "Aire sous x² de 0 à 3.", hint: "∫₀³ x²dx.", solution: "[x³/3]₀³=9." },
      { title: "IPP", statement: "∫₀¹ xeˣdx.", hint: "u=x, v'=eˣ.", solution: "[xeˣ]₀¹−∫eˣ=e−(e−1)=1." },
      { title: "Valeur moyenne", statement: "Valeur moyenne de f(x)=x² sur [0,3].", hint: "μ=(1/3)∫₀³ x²dx.", solution: "μ=9/3=3." },
      { title: "Aire entre courbes", statement: "Aire entre y=x et y=x² sur [0,1].", hint: "∫₀¹(x−x²)dx.", solution: "[x²/2−x³/3]₀¹=1/2−1/3=1/6." },
      { title: "IPP double", statement: "∫₀¹ x²eˣdx.", hint: "u=x², v'=eˣ. Puis IPP à nouveau.", solution: "[x²eˣ]−∫2xeˣ=(e)−2([xeˣ]−∫eˣ)=e−2(e−(e−1))=e−2." }
    ]
  },
  { id: "combinatoire", title: "Combinatoire", icon: "n!", color: "#facc15", theme: "Probabilités & Statistiques", metLink: `${BASE}#10`, coursePdf: [`${T}20Combi.pdf`], courseVideo: "https://youtu.be/VVY4K-OT4FI",
    methodVideos: [
      { cat: "Dénombrement", title: "Diagramme", url: "https://youtu.be/xwRvGbbu7PY" },
      { cat: "Dénombrement", title: "Principe multiplicatif", url: "https://youtu.be/wzo1XXXaaqY" },
      { cat: "Dénombrement", title: "p-uplets", url: "https://youtu.be/rlEbdewplHI" },
      { cat: "Arrangements", title: "Arrangements", url: "https://youtu.be/2fKdO9t8wfo" },
      { cat: "Permutations", title: "Permutations", url: "https://youtu.be/kWEFtcWl_xU" },
      { cat: "Combinaisons", title: "Combinaisons", url: "https://youtu.be/_ip2dV_BUTM" },
      { cat: "Combinaisons", title: "Lequel choisir ?", url: "https://youtu.be/hWkIwXXEECc" },
      { cat: "Coeff. binomiaux", title: "C(n,k) (1)", url: "https://youtu.be/-gvlrfFdaS8" },
      { cat: "Coeff. binomiaux", title: "C(n,k) (2)", url: "https://youtu.be/mfcBNlUuGaw" },
      { cat: "Coeff. binomiaux", title: "Triangle Pascal", url: "https://youtu.be/6JGrHD5nAoc" }
    ],
    demoVideos: [{ title: "Triangle de Pascal", url: "https://youtu.be/xVNjVABYOno" }, { title: "Parties d'un ensemble", url: "https://youtu.be/8MVCbhQF2ak" }],
    exerciseVideos: [],
        extraLinks: [
      { name: "XYMaths — Exercices Dénombrement", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/denombrement/", icon: "🎓" },
      { name: "Annales2maths — Exercices Combinatoire", url: "https://www.annales2maths.com/exercices-ts/", icon: "📝" },
    ],
    sections: ["Principe multiplicatif", "p-uplets", "Arrangements", "Permutations", "Combinaisons", "Triangle de Pascal"],
    keyFormulas: [{ name: "n!", formula: "1×2×...×n" }, { name: "A(n,p)", formula: "n!/(n−p)!" }, { name: "C(n,p)", formula: "n!/(p!(n−p)!)" }, { name: "Pascal", formula: "C(n,p)=C(n−1,p−1)+C(n−1,p)" }],
    quiz: [
      { q: "C(6,2)=?", choices: ["15", "12", "30", "6"], answer: 0, explanation: "(6×5)/2=15." },
      { q: "Anagrammes ABC:", choices: ["6", "3", "9", "8"], answer: 0, explanation: "3!=6." },
      { q: "3 parmi 10, sans ordre:", choices: ["Combinaison", "Arrangement", "Permutation", "p-uplet"], answer: 0, explanation: "Pas d'ordre→combinaison." }
    ],
    exercises: [
      { title: "Code", statement: "Code 4 chiffres distincts (0-9). Combien ?", hint: "Arrangement.", solution: "10×9×8×7=5040." },
      { title: "Comité", statement: "Choisir 3 personnes parmi 8 pour un comité. Combien ?", hint: "Ordre sans importance → combinaison.", solution: "C(8,3)=8!/(3!5!)=56." },
      { title: "Mots", statement: "Combien de mots de 5 lettres avec l'alphabet (26) si répétitions permises ?", hint: "p-uplet avec répétitions.", solution: "26⁵=11 876 376." },
      { title: "Pascal", statement: "C(10,3)+C(10,4)=?", hint: "Triangle de Pascal.", solution: "C(11,4)=330." }
    ]
  },
  { id: "probabilites", title: "Loi binomiale", icon: "P", color: "#f97316", theme: "Probabilités & Statistiques", metLink: `${BASE}#14`, coursePdf: [`${T}20VA1.pdf`], courseVideo: "https://youtu.be/xMmfPUoBTtM",
    methodVideos: [
      { cat: "Probas cond.", title: "P conditionnelle", url: "https://youtu.be/SWmkdKxXf_I" },
      { cat: "Probas cond.", title: "P totales", url: "https://youtu.be/qTpTBoZA7zY" },
      { cat: "Probas cond.", title: "Indépendance", url: "https://youtu.be/wdiMq_lTk1w" },
      { cat: "Loi binomiale", title: "Arbre (loi bino)", url: "https://youtu.be/b18_r8r4K2s" },
      { cat: "Loi binomiale", title: "Coeff. binomial", url: "https://youtu.be/-gvlrfFdaS8" },
      { cat: "Loi binomiale", title: "C(n,k) formules", url: "https://youtu.be/mfcBNlUuGaw" },
      { cat: "Loi binomiale", title: "Pascal", url: "https://youtu.be/6JGrHD5nAoc" },
      { cat: "Loi binomiale", title: "P avec loi bino", url: "https://youtu.be/1gMq2TJwSh0" }
    ],
    demoVideos: [{ title: "Expression loi binomiale", url: "https://youtu.be/R45L_2gS8lU" }],
    exerciseVideos: [
      { title: "P arbre loi bino", url: "https://youtu.be/I51aPG_layY" },
      { title: "P loi binomiale", url: "https://youtu.be/ehoo0PSLWwM" },
      { title: "BAC Loi binomiale", url: "https://youtu.be/tNmiZYMG-5A" },
      { title: "BAC Probas cond. 1", url: "https://youtu.be/7V7zRFislOQ" },
      { title: "BAC Probas cond. 2", url: "https://youtu.be/8QoucS-A3SE" },
      { title: "BAC Probas cond. 3", url: "https://youtu.be/GufeEqAeav8" }
    ],
        extraLinks: [
      { name: "XYMaths — Annales BAC Probabilités", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/probabilites.php", icon: "🎓" },
      { name: "Mathovore — Probabilités corrigés", url: "https://mathovore.fr/les-probabilites-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "APMEP — Annales officielles", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
    ],
    sections: ["P conditionnelles", "Indépendance", "P totales", "Épreuves indépendantes", "Loi B(n,p)", "E(X), V(X)"],
    keyFormulas: [{ name: "P(A|B)", formula: "P(A∩B)/P(B)" }, { name: "P totales", formula: "ΣP(Bᵢ)P(A|Bᵢ)" }, { name: "Binomiale", formula: "C(n,k)pᵏ(1−p)ⁿ⁻ᵏ" }, { name: "E(X)", formula: "np" }],
    quiz: [
      { q: "P(A∩B)=0.3, P(B)=0.5. P(A|B)?", choices: ["0.6", "0.15", "0.8", "0.3"], answer: 0, explanation: "0.3/0.5=0.6." },
      { q: "X~B(10,0.3). E(X)?", choices: ["3", "0.3", "10", "7"], answer: 0, explanation: "np=3." },
      { q: "A et B indép. ssi:", choices: ["P(A∩B)=P(A)P(B)", "P(A∩B)=0", "P(A|B)=P(B)", "P(A)=P(B)"], answer: 0, explanation: "Définition." },
      { q: "C(5,2)=?", choices: ["10", "20", "5", "25"], answer: 0, explanation: "(5×4)/2=10." }
    ],
    exercises: [
      { title: "Bayes", statement: "Test: sensibilité 95%, spécificité 90%, prévalence 2%. P(malade|+)?", hint: "Arbre+Bayes.", solution: "P(+)=0.117. P(M|+)≈16.2%." },
      { title: "Loi bino", statement: "8 lancers, P(pile)=0.6. P(5 piles)?", hint: "X~B(8,0.6).", solution: "C(8,5)×0.6⁵×0.4³≈0.279." },
      { title: "P totales", statement: "Urne A: 3R 2B. Urne B: 1R 4B. On tire A avec P=0.4, B sinon. P(rouge)?", hint: "P(R)=P(A)P(R|A)+P(B)P(R|B).", solution: "P(R)=0.4×3/5+0.6×1/5=0.24+0.12=0.36." },
      { title: "Indépendance", statement: "P(A)=0.3, P(B)=0.5, P(A∩B)=0.15. A et B indépendants?", hint: "Vérifier P(A∩B)=P(A)×P(B).", solution: "0.3×0.5=0.15=P(A∩B). Oui, indépendants." },
      { title: "E et V", statement: "X~B(20,0.3). E(X), V(X), σ(X)?", hint: "E=np, V=np(1−p).", solution: "E=6, V=20×0.3×0.7=4.2, σ≈2.05." }
    ]
  },
  { id: "grands_nombres", title: "Loi des grands nombres", icon: "μ", color: "#ea580c", theme: "Probabilités & Statistiques", metLink: `${BASE}#15`, coursePdf: [`${T}20VA2.pdf`, `${T}20GrandN.pdf`], courseVideo: "https://youtu.be/GweMOVratYI",
    methodVideos: [
      { cat: "Somme VA", title: "Loi somme VA", url: "https://youtu.be/0l7tz8oGh-s" },
      { cat: "Somme VA", title: "VA de transition", url: "https://youtu.be/ljITvCBExVY" },
      { cat: "Somme VA", title: "E et V somme (1)", url: "https://youtu.be/19nVXFHbmjU" },
      { cat: "Somme VA", title: "E et V somme (2)", url: "https://youtu.be/fRYVMQk3bQQ" },
      { cat: "Loi bino", title: "E bino", url: "https://youtu.be/95t19fznDOU" },
      { cat: "Loi bino", title: "V et σ bino", url: "https://youtu.be/MvCZw9XIZ4Q" },
      { cat: "Concentration", title: "E, V, σ VA moyenne", url: "https://youtu.be/o67OOavrbHQ" },
      { cat: "Concentration", title: "Bienaymé-Tchebychev", url: "https://youtu.be/4XMvq1FnYwU" },
      { cat: "Concentration", title: "Inég. concentration", url: "https://youtu.be/7Nk9U-zwWOA" },
      { cat: "Grands nombres", title: "Loi des grands nombres", url: "https://youtu.be/fzuNxQSDTb8" }
    ],
    demoVideos: [{ title: "E et V loi binomiale", url: "https://youtu.be/ljWJfGLRgJE" }],
    exerciseVideos: [{ title: "E V σ loi binomiale", url: "https://youtu.be/W98SSzPSAtQ" }],
        extraLinks: [
      { name: "XYMaths — Exercices VA / Grands nombres", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/probabilites/", icon: "🎓" },
      { name: "Annales2maths — BAC Probas", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "📝" },
    ],
    sections: ["Somme de VA", "E et V somme", "VA moyenne", "Bienaymé-Tchebychev", "Concentration", "Loi des grands nombres"],
    keyFormulas: [{ name: "E(X+Y)", formula: "E(X)+E(Y)" }, { name: "V indép.", formula: "V(X)+V(Y)" }, { name: "B-T", formula: "P(|X−E|≥δ)≤V/δ²" }, { name: "Concentration", formula: "V(X)/(nδ²)" }],
    quiz: [
      { q: "E(X₁+X₂)=?", choices: ["E(X₁)+E(X₂)", "E(X₁)×E(X₂)", "E/2", "max"], answer: 0, explanation: "Linéarité." },
      { q: "Mₙ converge vers:", choices: ["E(X)", "0", "1", "V(X)"], answer: 0, explanation: "Loi des grands nombres." }
    ],
    exercises: [
      { title: "Échantillon", statement: "X~B(1,0.5). n pour P(|Mₙ−0.5|≥0.05)≤0.05?", hint: "Concentration: V/(nδ²)≤α.", solution: "0.25/(n×0.0025)≤0.05→n≥2000." },
      { title: "E et V somme", statement: "10 dés, Xi = résultat dé i. E(S) et V(S)?", hint: "E(Xi)=3.5, V(Xi)=35/12.", solution: "E(S)=35, V(S)=10×35/12≈29.2." },
      { title: "Bienaymé-Tchebychev", statement: "X: E(X)=100, V(X)=25. Majorer P(|X−100|≥10).", hint: "B-T: P≤V/δ².", solution: "P(|X−100|≥10)≤25/100=0.25." }
    ]
  },
  { id: "geometrie", title: "Géométrie dans l'espace", icon: "◇", color: "#14b8a6", theme: "Géométrie", metLink: `${BASE}#11`, coursePdf: [`${T}20Esp1.pdf`, `${T}20Esp2.pdf`, `${T}20Esp3.pdf`], courseVideo: "https://youtu.be/EoT48VtnUJ4",
    methodVideos: [
      { cat: "Vecteurs", title: "Combinaisons linéaires", url: "https://youtu.be/Z83z54pkGqA" },
      { cat: "Vecteurs", title: "Exprimer un vecteur", url: "https://youtu.be/l4FeV0-otP4" },
      { cat: "Vecteurs", title: "Plans parallèles", url: "https://youtu.be/6B1liGkQL8E" },
      { cat: "Vecteurs", title: "4 pts coplanaires", url: "https://youtu.be/9baU60ZNioo" },
      { cat: "Vecteurs", title: "Base de l'espace", url: "https://youtu.be/5a9pE6XQna4" },
      { cat: "Vecteurs", title: "Coordonnées", url: "https://youtu.be/PZeBXIhNBAk" },
      { cat: "Orthogonalité", title: "Produit scalaire", url: "https://youtu.be/vp3ICG3rRQk" },
      { cat: "Orthogonalité", title: "Vecteurs orthogonaux", url: "https://youtu.be/N1IA15sKH-E" },
      { cat: "Orthogonalité", title: "Orthogonalité (PS)", url: "https://youtu.be/8Obh6cIZeEw" },
      { cat: "Orthogonalité", title: "Droites orthogonales", url: "https://youtu.be/qKWghhaQJUs" },
      { cat: "Orthogonalité", title: "Vecteur normal", url: "https://youtu.be/aAnz_cP72Q4" },
      { cat: "Orthogonalité", title: "Déterminer normal", url: "https://youtu.be/IDBEI6thBPU" },
      { cat: "Orthogonalité", title: "Distance pt-plan", url: "https://youtu.be/1b9FtX4sCmQ" },
      { cat: "Éq. / Repr.", title: "Repr. param. droite", url: "https://youtu.be/smCUbzJs9xo" },
      { cat: "Éq. / Repr.", title: "Éq. cart. plan", url: "https://youtu.be/s4xqI6IPQBY" },
      { cat: "Éq. / Repr.", title: "Intersection droite/plan", url: "https://youtu.be/BYBMauyizhE" },
      { cat: "Éq. / Repr.", title: "Projeté orth. sur droite", url: "https://youtu.be/RoacrySlUAU" },
      { cat: "Éq. / Repr.", title: "Intersection 2 plans", url: "https://youtu.be/4dkZ0OQQwaQ" },
      { cat: "Éq. / Repr.", title: "Plans orthogonaux", url: "https://youtu.be/okvo1SUtHUc" }
    ],
    demoVideos: [{ title: "Projeté orth. = plus proche", url: "https://youtu.be/c7mxA0TbVFU" }, { title: "Éq. cart. avec normal", url: "https://youtu.be/GKsHtrImI_o" }],
    exerciseVideos: [{ title: "BAC Vecteurs repr. param.", url: "https://youtu.be/gYNat8r4XRE" }, { title: "BAC PS droite plan algo", url: "https://youtu.be/dQd3SbhoPF4" }],
        extraLinks: [
      { name: "XYMaths — Annales BAC Géométrie espace", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/geometrie-espace.php", icon: "🎓" },
      { name: "Mathovore — Géométrie espace corrigés", url: "https://mathovore.fr/la-geometrie-dans-l-espace-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — DS et BAC", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Vecteurs espace", "Coplanaires", "Positions relatives", "Produit scalaire", "Orthogonalité", "Repr. param. droites", "Éq. cart. plans", "Intersection", "Distance"],
    keyFormulas: [{ name: "Éq. plan", formula: "ax+by+cz+d=0" }, { name: "Normal", formula: "n⃗(a,b,c)" }, { name: "Distance", formula: "|ax₀+by₀+cz₀+d|/√(a²+b²+c²)" }, { name: "Param.", formula: "(x,y,z)=A+tu⃗" }],
    quiz: [
      { q: "Normal de 2x−y+3z=5:", choices: ["(2,−1,3)", "(2,1,3)", "(−2,1,−3)", "(5,0,0)"], answer: 0, explanation: "n⃗=(a,b,c)." },
      { q: "Plans // ⟺ normales:", choices: ["Colinéaires", "Orthogonales", "Égales", "Même norme"], answer: 0, explanation: "Normales colinéaires." },
      { q: "Droite⊥plan ⟺ directeur:", choices: ["Colinéaire au normal", "Orthogonal", "Nul", "Dans le plan"], answer: 0, explanation: "Directeur colinéaire au normal." }
    ],
    exercises: [
      { title: "Intersection", statement: "Plan x+y+z=6, droite (1,0,2)+t(1,1,1).", hint: "Substituer.", solution: "3+3t=6→t=1→(2,1,3)." },
      { title: "Distance", statement: "A(3,−1,2) au plan 2x−y+2z−1=0.", hint: "Formule.", solution: "|6+1+4−1|/3=10/3." },
      { title: "Éq. plan", statement: "Plan passant par A(1,0,0) de normal n⃗(2,−1,3).", hint: "2(x−1)−1(y)+3(z)=0.", solution: "2x−y+3z−2=0." },
      { title: "Repr. param.", statement: "Droite par A(1,2,3) de vecteur u⃗(1,−1,2). Repr. paramétrique.", hint: "(x,y,z)=A+tu⃗.", solution: "x=1+t, y=2−t, z=3+2t." },
      { title: "Projeté", statement: "Projeté de M(1,1,1) sur le plan x+y+z=0.", hint: "H=M+tn⃗ avec H dans le plan.", solution: "(1+t)+(1+t)+(1+t)=0→t=−1. H=(0,0,0)." }
    ]
  },
  { id: "complexes", title: "Nombres complexes", icon: "ℂ", color: "#0ea5e9", theme: "Géométrie", metLink: `${BASE}#27`, coursePdf: [`${T}20NC1.pdf`, `${T}20NC2.pdf`, `${T}20NC3.pdf`, `${T}20NC4.pdf`], courseVideo: "https://youtu.be/ABo2m52oEYw",
    methodVideos: [
      { cat: "Algébrique", title: "Forme algébrique (1)", url: "https://youtu.be/-aaSfL2fhTY" },
      { cat: "Algébrique", title: "Forme algébrique (2)", url: "https://youtu.be/1KQIUqzVGqQ" },
      { cat: "Algébrique", title: "Conjugué", url: "https://youtu.be/WhKHo9YwafE" },
      { cat: "Algébrique", title: "Éq. avec conjugué", url: "https://youtu.be/qu7zGL5y4vI" },
      { cat: "Algébrique", title: "Binôme", url: "https://youtu.be/UsYH9PvppPo" },
      { cat: "Algébrique", title: "Éq. 2nd degré ℂ", url: "https://youtu.be/KCnorHy5FE4" },
      { cat: "Géométrique", title: "Affixe vecteur", url: "https://youtu.be/D_yFqcCy3iE" },
      { cat: "Géométrique", title: "Affixe en géométrie", url: "https://youtu.be/m9yM6kw1ZzU" },
      { cat: "Géométrique", title: "Module (1)", url: "https://youtu.be/Hu0jjS5O2u4" },
      { cat: "Géométrique", title: "Module (2)", url: "https://youtu.be/i85d2fKv34w" },
      { cat: "Géométrique", title: "Argument", url: "https://youtu.be/NX3pzPL2gwc" },
      { cat: "Formes", title: "Trigo→algébrique", url: "https://youtu.be/kmb3-hNiBq8" },
      { cat: "Formes", title: "Algébrique→trigo (1)", url: "https://youtu.be/zIbpXlgISc4" },
      { cat: "Formes", title: "Algébrique→trigo (2)", url: "https://youtu.be/RqRQ2m-9Uhw" },
      { cat: "Formes", title: "Forme expo (1)", url: "https://youtu.be/WSW6DIbCS_0" },
      { cat: "Formes", title: "Forme expo (2)", url: "https://youtu.be/tEKJVKKQazA" },
      { cat: "Formes", title: "Expo→algébrique", url: "https://youtu.be/zdxRt5poJp0" },
      { cat: "Formes", title: "Utiliser expo", url: "https://youtu.be/8EVfyqyVBKc" },
      { cat: "Trigo", title: "cos/sin addition", url: "https://youtu.be/WcTWAazcXds" },
      { cat: "Trigo", title: "cos/sin duplication", url: "https://youtu.be/RPtAUl3oLco" },
      { cat: "Trigo", title: "Moivre", url: "https://youtu.be/RU2C4i3n5Ik" },
      { cat: "Trigo", title: "Euler linéariser", url: "https://youtu.be/p6TncUjPKfQ" },
      { cat: "Applications géo.", title: "Complexes en géom.", url: "https://youtu.be/NjLZfbqRFB0" },
      { cat: "Applications géo.", title: "Ensemble pts (1)", url: "https://youtu.be/WTXu19XC9Lw" },
      { cat: "Applications géo.", title: "Ensemble pts (2)", url: "https://youtu.be/5puq7tzMZAo" },
      { cat: "Applications géo.", title: "Ensemble pts (3)", url: "https://youtu.be/r6RO4ifOf70" },
      { cat: "Racines", title: "Racines de l'unité", url: "https://youtu.be/PZWgjj_7G7c" },
      { cat: "Racines", title: "Racines n-ièmes", url: "https://youtu.be/cqK_IGw_0fE" }
    ],
    demoVideos: [],
    exerciseVideos: [{ title: "Éq. trigo (addition)", url: "https://youtu.be/sCUNjZ6yqac" }, { title: "Moivre", url: "https://youtu.be/7z7s6NVSyj0" }, { title: "Euler", url: "https://youtu.be/rsrDqzMtu6M" }, { title: "BAC Complexes", url: "https://youtu.be/SeyMF4uikOI" }],
        extraLinks: [
      { name: "XYMaths — Exercices Complexes", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/nombres-complexes/", icon: "🎓" },
      { name: "Mathovore — Complexes corrigés", url: "https://mathovore.fr/les-nombres-complexes-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "APMEP — Annales BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "🏛" },
    ],
    sections: ["Forme algébrique", "Conjugué/module", "Forme trigo", "Forme expo", "Euler/Moivre", "Résolution ℂ", "Géométrie", "Racines n-ièmes"],
    keyFormulas: [{ name: "Module", formula: "|z|=√(a²+b²)" }, { name: "Expo", formula: "z=|z|e^(iθ)" }, { name: "Euler", formula: "e^(iπ)+1=0" }, { name: "Moivre", formula: "(cosθ+isinθ)ⁿ=cos(nθ)+isin(nθ)" }],
    quiz: [
      { q: "|3+4i|=?", choices: ["5", "7", "1", "√7"], answer: 0, explanation: "√(9+16)=5." },
      { q: "Conjugué de 2−3i:", choices: ["2+3i", "−2+3i", "−2−3i", "3−2i"], answer: 0, explanation: "Conjugué de a+bi=a−bi." },
      { q: "e^(iπ)=?", choices: ["−1", "1", "i", "0"], answer: 0, explanation: "Euler." },
      { q: "arg(i)=?", choices: ["π/2", "π", "0", "−π/2"], answer: 0, explanation: "i=e^(iπ/2)." }
    ],
    exercises: [
      { title: "Forme algébrique", statement: "(1+i)/(1−i) sous forme algébrique.", hint: "Conjugué du dénominateur.", solution: "=(1+i)²/2=2i/2=i. |z|=1, arg=π/2." },
      { title: "Racines", statement: "z²=−4 dans ℂ.", hint: "z²=4e^(iπ).", solution: "z=2i ou z=−2i." },
      { title: "Module/argument", statement: "z=−1+i√3. Module et argument ?", hint: "|z|=√(1+3)=2. Rechercher θ.", solution: "|z|=2. cos θ=−1/2, sin θ=√3/2 → θ=2π/3." },
      { title: "Eq. 2nd degré", statement: "z²−2z+5=0 dans ℂ.", hint: "Δ=4−20=−16.", solution: "Δ=−16, √Δ=4i. z=(2±4i)/2=1±2i." },
      { title: "Géométrie", statement: "A(2+i), B(−1+3i). Milieu et distance AB ?", hint: "Milieu=(zA+zB)/2. Distance=|zB−zA|.", solution: "M=(1/2+2i). AB=|−3+2i|=√13." },
      { title: "Forme expo", statement: "Écrire z=1+i sous forme exponentielle.", hint: "|z|=√2, arg(z)=π/4.", solution: "z=√2·e^(iπ/4)." }
    ]
  }
];
const THEMES = [...new Set(CHAPTERS.map(c => c.theme))];
const TC = {"Analyse":"#8b5cf6","Probabilités & Statistiques":"#f97316","Géométrie":"#0ea5e9"};
const CONFIG = {prof:{name:"Imran",pin:"1234"},eleve:{name:"Sami",pin:"0000"},appTitle:"Maths Terminale"};

// ─── PARCOURS GUIDÉ ─────────────────────────────────────────
const LEARNING_PATH = [
  { id: "suites", step: 1, bloc: "Fondations", prerequis1ere: "Suites arithmétiques et géométriques (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#suite" },
  { id: "limites", step: 2, bloc: "Fondations", prerequis1ere: "Fonctions de référence, tableau de variations (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#second" },
  { id: "derivation", step: 3, bloc: "Fondations", prerequis1ere: "Dérivation en 1ère (nombre dérivé, tangente)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#derivation" },
  { id: "continuite", step: 4, bloc: "Analyse approfondie", prerequis1ere: null },
  { id: "convexite", step: 5, bloc: "Analyse approfondie", prerequis1ere: null },
  { id: "logarithme", step: 6, bloc: "Fonctions avancées", prerequis1ere: "Fonction exponentielle (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#exponentielle" },
  { id: "trigo", step: 7, bloc: "Fonctions avancées", prerequis1ere: "Trigonométrie (1ère) : cercle trigo, cos/sin", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#trigo" },
  { id: "primitives", step: 8, bloc: "Calcul intégral", prerequis1ere: null },
  { id: "integration", step: 9, bloc: "Calcul intégral", prerequis1ere: null },
  { id: "combinatoire", step: 10, bloc: "Probabilités", prerequis1ere: "Probabilités (1ère) : arbres, indépendance", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#proba" },
  { id: "probabilites", step: 11, bloc: "Probabilités", prerequis1ere: null },
  { id: "grands_nombres", step: 12, bloc: "Probabilités", prerequis1ere: null },
  { id: "geometrie", step: 13, bloc: "Géométrie", prerequis1ere: "Produit scalaire (1ère), vecteurs (2nde)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#scalaire" },
  { id: "complexes", step: 14, bloc: "Géométrie", prerequis1ere: null },
];
const PATH_MAP = Object.fromEntries(LEARNING_PATH.map(p => [p.id, p]));

// ─── STORAGE (Supabase → window.storage → localStorage) ───
async function dbGet(k){
  // 1. Supabase (si configuré)
  if(supabase){try{const{data}=await supabase.from("classroom_data").select("value").eq("key",k).maybeSingle();if(data)return data.value;}catch(e){console.warn("Supabase read error",e);}}
  // 2. window.storage (IndexedDB natif si dispo)
  try{if(window.storage){const r=await window.storage.get(k);return r&&r.value?JSON.parse(r.value):null;}}catch{}
  // 3. localStorage (fallback ultime)
  try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}
}
async function dbSet(k,v){
  // 1. Supabase (si configuré)
  if(supabase){try{await supabase.from("classroom_data").upsert({key:k,value:v,updated_at:new Date().toISOString()},{onConflict:"key"});}catch(e){console.warn("Supabase write error",e);}}
  // 2. localStorage (cache local)
  const s=JSON.stringify(v);
  try{if(window.storage){await window.storage.set(k,s);return;}}catch{}
  try{localStorage.setItem(k,s);}catch{}
}

// ─── COMPONENTS ─────────────────────────────────────────────
function Ring({p=0,sz=48,sw=4,c="#6366f1"}){const r=(sz-sw)/2,ci=2*Math.PI*r,o=ci-((Number(p)||0)/100)*ci;return <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .6s"}}/><text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central" style={{transform:"rotate(90deg)",transformOrigin:"center",fontSize:sz*.28,fill:"#1e293b",fontWeight:700}}>{Math.round(Number(p)||0)}%</text></svg>;}
function Badge({children,color,s}){return <span style={{display:"inline-flex",alignItems:"center",padding:s?"2px 8px":"4px 12px",borderRadius:20,fontSize:s?11:12,fontWeight:600,background:color+"22",color,border:"1px solid "+color+"44"}}>{children}</span>;}
function VLink({v,bg}){return <a href={v.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:5,borderRadius:12,background:bg||"#fef2f2",border:"1px solid #fecaca",textDecoration:"none",color:"#1e293b",fontSize:13}}><span style={{width:30,height:30,borderRadius:8,background:"#fee2e2",color:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>▶</span><span style={{fontWeight:500}}>{v.title}</span></a>;}
function Sec({children,style}){return <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:16,padding:20,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)",...(style||{})}}>{children}</div>;}

const qoStyle=(sel,ok,bad,done)=>({display:"block",width:"100%",textAlign:"left",padding:"14px 18px",marginBottom:8,borderRadius:14,cursor:done?"default":"pointer",fontSize:14,fontWeight:500,border:"2px solid "+(done&&ok?"#22c55e":done&&bad?"#ef4444":sel?"#6366f1":"#e2e8f0"),background:done&&ok?"#f0fdf4":done&&bad?"#fef2f2":sel?"#eef2ff":"white",color:"#1e293b"});
const btnBase={background:"white",border:"1px solid #d1d5db",color:"#4f46e5",padding:"10px 20px",borderRadius:12,cursor:"pointer",fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6};
const inputBase={width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #d1d5db",background:"white",color:"#1e293b",fontSize:14,outline:"none",boxSizing:"border-box"};
const navBtnStyle=(a)=>({padding:"12px 20px",border:"none",borderRadius:14,cursor:"pointer",fontSize:13,fontWeight:600,background:a?"#6366f1":"white",color:a?"white":"#64748b",display:"flex",alignItems:"center",gap:8,flex:"1 1 0",justifyContent:"center",boxShadow:a?"0 2px 8px rgba(99,102,241,.3)":"0 1px 3px rgba(0,0,0,.06)"});
const appBg={minHeight:"100vh",background:"linear-gradient(135deg,#f8fafc 0%,#eef2ff 50%,#f0f9ff 100%)",color:"#1e293b",fontFamily:"'Segoe UI',system-ui,sans-serif"};
const ctrStyle={maxWidth:1100,margin:"0 auto",padding:"20px 24px"};
const fmtTime=(s)=>{const n=Number(s)||0;if(n<60)return n>0?n+"s":"0min";const h=Math.floor(n/3600),m=Math.floor((n%3600)/60);return h>0?h+"h"+(m>0?m+"min":""):m+"min";};

// ─── APP ────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [pin,setPin]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [page,setPage]=useState("home");
  const [ch,setCh]=useState(null);
  const [tab,setTab]=useState("cours");
  const [filt,setFilt]=useState("all");
  const [qa,setQa]=useState({});
  const [qDone,setQDone]=useState(false);
  const [qIdx,setQIdx]=useState(0);
  const [hints,setHints]=useState({});
  const [sols,setSols]=useState({});
  const [prog,setProg]=useState({});
  const [msgs,setMsgs]=useState([]);
  const [msgDraft,setMsgDraft]=useState("");
  const [files,setFiles]=useState([]);
  const [fileComment,setFileComment]=useState("");
  const [aiMsgs,setAiMsgs]=useState([{role:"assistant",content:"Salut ! Je suis ton tuteur IA en maths Terminale. Pose-moi n'importe quelle question 🎯"}]);
  const [aiInput,setAiInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [fbIdx,setFbIdx]=useState(null);
  const [fbText,setFbText]=useState("");
  const [customExos,setCustomExos]=useState({});
  const [exoForm,setExoForm]=useState({title:"",statement:"",hint:"",solution:"",chapter:"",file:null,fileName:"",fileType:""});
  const [search,setSearch]=useState("");
  const [weekGoals,setWeekGoals]=useState([]);
  const [goalDraft,setGoalDraft]=useState("");
  const [timeSpent,setTimeSpent]=useState({});
  const [dbOnline,setDbOnline]=useState(false);
  const chatRef=useRef(null);
  const fileRef=useRef(null);
  const exoFileRef=useRef(null);
  const chRef=useRef(null);
  const timerRef=useRef(0);
  const tsRef=useRef({});
  tsRef.current=timeSpent;

  // ─── STORAGE ──────────────────────────────────────────────
  useEffect(()=>{(async()=>{try{
    const[p,m,f,c,ce,wg,ts]=await Promise.all([dbGet("mt-prog"),dbGet("mt-msgs"),dbGet("mt-files"),dbGet("mt-ai"),dbGet("mt-exos"),dbGet("mt-goals"),dbGet("mt-time")]);
    if(p&&typeof p==="object"&&!Array.isArray(p))setProg(p);
    if(Array.isArray(m))setMsgs(m);
    if(Array.isArray(f))setFiles(f);
    if(Array.isArray(c)&&c.length)setAiMsgs(c);
    if(ce&&typeof ce==="object"&&!Array.isArray(ce))setCustomExos(ce);
    if(Array.isArray(wg))setWeekGoals(wg);
    if(ts&&typeof ts==="object"&&!Array.isArray(ts))setTimeSpent(ts);
    if(supabase)setDbOnline(true);
  }catch(e){console.log("load err",e);}})();},[]);

  const sv=useCallback((k,v)=>{dbSet(k,v);},[]);

  // ─── SUPABASE REALTIME ────────────────────────────────────
  useEffect(()=>{
    if(!supabase)return;
    const applyKey=(key,val)=>{
      if(key==="mt-msgs"&&Array.isArray(val))setMsgs(val);
      else if(key==="mt-files"&&Array.isArray(val))setFiles(val);
      else if(key==="mt-prog"&&val&&typeof val==="object"&&!Array.isArray(val))setProg(val);
      else if(key==="mt-exos"&&val&&typeof val==="object"&&!Array.isArray(val))setCustomExos(val);
      else if(key==="mt-goals"&&Array.isArray(val))setWeekGoals(val);
      else if(key==="mt-time"&&val&&typeof val==="object"&&!Array.isArray(val))setTimeSpent(val);
    };
    const channel=supabase.channel("classroom-realtime")
      .on("postgres_changes",{event:"*",schema:"public",table:"classroom_data"},(payload)=>{
        const key=payload.new?.key||payload.old?.key;
        const val=payload.new?.value;
        if(key&&val!==undefined)applyKey(key,val);
        else if(key)dbGet(key).then(v=>{if(v!==null)applyKey(key,v);});
      })
      .subscribe((status)=>{setDbOnline(status==="SUBSCRIBED");});
    return()=>{supabase.removeChannel(channel);};
  },[]);

  // ─── TIMER ────────────────────────────────────────────────
  const stopT=()=>{if(timerRef.current&&chRef.current){const e=Math.round((Date.now()-timerRef.current)/1000);if(e>5){const n={...tsRef.current,[chRef.current.id]:(tsRef.current[chRef.current.id]||0)+e};setTimeSpent(n);sv("mt-time",n);}}timerRef.current=0;};

  // ─── AUTH ─────────────────────────────────────────────────
  const login=(role)=>{const c=CONFIG[role];if(pin===c.pin){setUser({name:c.name,role});setLoginErr("");setPin("");}else setLoginErr("Code incorrect");};
  const isProf=user?.role==="prof";

  // ─── NAV ──────────────────────────────────────────────────
  const openCh=(c)=>{stopT();setCh(c);chRef.current=c;setPage("chapter");setTab("cours");setQa({});setQDone(false);setQIdx(0);setHints({});setSols({});timerRef.current=Date.now();};
  const goHome=()=>{stopT();setPage("home");setCh(null);chRef.current=null;};
  const navTo=(p)=>{stopT();setPage(p);};

  // ─── QUIZ ─────────────────────────────────────────────────
  const submitQ=()=>{if(!ch)return;let s=0;ch.quiz.forEach((q,i)=>{if(qa[i]===q.answer)s++;});const pct=Math.round(s/ch.quiz.length*100);setQDone(true);const np={...prog,[ch.id]:{best:Math.max((prog[ch.id]?.best)||0,pct),n:(prog[ch.id]?.n||0)+1,last:new Date().toISOString()}};setProg(np);sv("mt-prog",np);};

  // ─── MESSAGES ─────────────────────────────────────────────
  const sendMsg=()=>{if(!msgDraft.trim())return;const nm=[...msgs,{from:user.role,text:msgDraft.trim(),ts:new Date().toISOString()}];setMsgs(nm);setMsgDraft("");sv("mt-msgs",nm);};

  // ─── FILES ────────────────────────────────────────────────
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{const nf=[...files,{name:f.name,size:f.size,type:f.type,data:ev.target.result,from:user.role,ts:new Date().toISOString(),comment:fileComment,feedback:""}];setFiles(nf);setFileComment("");sv("mt-files",nf);};r.readAsDataURL(f);};
  const addFb=(idx,fb)=>{const nf=[...files];nf[idx]={...nf[idx],feedback:fb};setFiles(nf);sv("mt-files",nf);};

  // ─── CUSTOM EXERCISES ─────────────────────────────────────
  const handleExoFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setExoForm(p=>({...p,file:ev.target.result,fileName:f.name,fileType:f.type}));};r.readAsDataURL(f);};
  const saveExo=()=>{if(!exoForm.title||!exoForm.chapter||(!exoForm.statement&&!exoForm.file))return;const id=exoForm.chapter;const ne={...customExos,[id]:[...(customExos[id]||[]),{title:exoForm.title,statement:exoForm.statement||"(voir document)",hint:exoForm.hint,solution:exoForm.solution,file:exoForm.file,fileName:exoForm.fileName,fileType:exoForm.fileType,byProf:true,ts:new Date().toISOString()}]};setCustomExos(ne);sv("mt-exos",ne);setExoForm({title:"",statement:"",hint:"",solution:"",chapter:"",file:null,fileName:"",fileType:""});if(exoFileRef.current)exoFileRef.current.value="";};
  const delExo=(id,i)=>{const ne={...customExos,[id]:customExos[id].filter((_,j)=>j!==i)};setCustomExos(ne);sv("mt-exos",ne);};

  // ─── AI CHAT (Groq — gratuit) ─────────────────────────────
  const sendAi=async()=>{
    if(!aiInput.trim()||aiLoading)return;
    const apiKey=process.env.REACT_APP_GROQ_API_KEY||"";
    if(!apiKey){setAiMsgs(p=>[...p,{role:"assistant",content:"⚠️ Clé API manquante. Ajoute REACT_APP_GROQ_API_KEY dans ton fichier .env"}]);return;}
    const um=aiInput.trim();setAiInput("");
    const nm=[...aiMsgs,{role:"user",content:um}];
    setAiMsgs(nm);setAiLoading(true);
    try{
      const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},body:JSON.stringify({model:"llama-3.1-70b-versatile",max_tokens:1024,messages:[{role:"system",content:"Tu es un tuteur bienveillant spécialisé en mathématiques de Terminale (programme français). Tu expliques clairement, étape par étape, avec des exemples concrets. Tu utilises les symboles Unicode mathématiques (∑, ∫, √, π, ∞, ≤, ≥). Tu réponds toujours en français."}, ...nm.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}))]})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error?.message||"Erreur API Groq");
      const reply=d.choices?.[0]?.message?.content||"Erreur.";
      const f=[...nm,{role:"assistant",content:reply}];setAiMsgs(f);sv("mt-ai",f);
    }catch(err){setAiMsgs(p=>[...p,{role:"assistant",content:"⚠️ "+err.message}]);}
    setAiLoading(false);
  };
  useEffect(()=>{chatRef.current?.scrollTo(0,chatRef.current.scrollHeight);},[aiMsgs]);

  // ─── WEEKLY GOALS ─────────────────────────────────────────
  const addGoal=()=>{if(!goalDraft.trim())return;const ng=[...weekGoals,{text:goalDraft.trim(),done:false}];setWeekGoals(ng);setGoalDraft("");sv("mt-goals",ng);};
  const toggleGoal=(i)=>{const ng=[...weekGoals];ng[i]={...ng[i],done:!ng[i].done};setWeekGoals(ng);sv("mt-goals",ng);};
  const delGoal=(i)=>{const ng=weekGoals.filter((_,j)=>j!==i);setWeekGoals(ng);sv("mt-goals",ng);};

  // ─── COMPUTED ─────────────────────────────────────────────
  const stats=useMemo(()=>{const a=CHAPTERS.filter(c=>prog[c.id]?.n>0).length,m=CHAPTERS.filter(c=>(prog[c.id]?.best||0)>=80).length,avg=CHAPTERS.length?Math.round(CHAPTERS.reduce((s,c)=>s+(prog[c.id]?.best||0),0)/CHAPTERS.length):0;return{a,m,avg};},[prog]);
  const totalTime=useMemo(()=>{try{return Object.values(timeSpent).reduce((a,b)=>(Number(a)||0)+(Number(b)||0),0);}catch{return 0;}},[timeSpent]);
  const streak=useMemo(()=>{try{const days=new Set();Object.values(prog).forEach(p=>{if(p?.last)days.add(String(p.last).slice(0,10));});let c=0,d=new Date();for(let i=0;i<365;i++){if(days.has(d.toISOString().slice(0,10))){c++;d.setDate(d.getDate()-1);}else break;}return c;}catch{return 0;}},[prog]);
  const searchRes=useMemo(()=>{if(!search.trim())return[];const q=search.toLowerCase();return CHAPTERS.filter(c=>c.title.toLowerCase().includes(q)||c.sections.some(s=>s.toLowerCase().includes(q))||c.theme.toLowerCase().includes(q));},[search]);
  const nextStep=useMemo(()=>LEARNING_PATH.find(lp=>(prog[lp.id]?.best||0)<60),[prog]);
  const unread=Array.isArray(msgs)?msgs.filter(m=>m&&m.from!==(isProf?"prof":"eleve")).length:0;
  const list=filt==="all"?CHAPTERS:CHAPTERS.filter(c=>c.theme===filt);

  // ═══════════════════════════════════════════════════════════
  // LOGIN
  if(!user)return(
    <div style={appBg}><div style={{...ctrStyle,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <h1 style={{fontSize:38,fontWeight:800,margin:"0 0 8px",background:"linear-gradient(135deg,#6366f1,#a855f7,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{CONFIG.appTitle}</h1>
        <p style={{color:"#64748b",fontSize:15,marginBottom:32}}>Plateforme de révision — Prof & Élève</p>
        <Sec>
          <p style={{fontSize:14,color:"#4f46e5",fontWeight:600,marginBottom:16}}>Entrez votre code PIN</p>
          <input type="password" maxLength={4} value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&pin.length===4)login("eleve");}} placeholder="• • • •" style={{...inputBase,textAlign:"center",fontSize:24,letterSpacing:12,marginBottom:16}} />
          {loginErr?<p style={{color:"#ef4444",fontSize:13,marginBottom:12}}>{loginErr}</p>:null}
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>login("prof")} style={{flex:1,padding:14,borderRadius:14,border:"2px solid #a5b4fc",background:"#eef2ff",color:"#4f46e5",fontSize:15,fontWeight:700,cursor:"pointer"}}>👨‍🏫 {CONFIG.prof.name}</button>
            <button onClick={()=>login("eleve")} style={{flex:1,padding:14,borderRadius:14,border:"2px solid #86efac",background:"#f0fdf4",color:"#16a34a",fontSize:15,fontWeight:700,cursor:"pointer"}}>🎓 {CONFIG.eleve.name}</button>
          </div>
        </Sec>
      </div>
    </div></div>
  );

  // ─── SHARED UI BLOCKS ─────────────────────────────────────
  const welcome=<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><div><h1 style={{fontSize:28,fontWeight:800,margin:0,color:"#0f172a"}}>{isProf?"Bonjour, "+CONFIG.prof.name:"Salut "+CONFIG.eleve.name+" 👋"}</h1><p style={{color:"#64748b",fontSize:13,marginTop:2}}>{isProf?"Tableau de bord professeur":"Prêt à réviser ?"}</p></div><Badge color={isProf?"#6366f1":"#22c55e"}>{user.name}</Badge></div>;

  const nav=<div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
    <button onClick={goHome} style={navBtnStyle(page==="home")}>📚 Cours</button>
    <button onClick={()=>navTo("chatbot")} style={navBtnStyle(page==="chatbot")}>🤖 Tuteur IA</button>
    <button onClick={()=>navTo("files")} style={navBtnStyle(page==="files")}>📎 Fichiers</button>
    <button onClick={()=>navTo("inbox")} style={navBtnStyle(page==="inbox")}>💬 Messages{unread>0?<span style={{background:"#ef4444",color:"white",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700,marginLeft:4}}>{unread}</span>:null}</button>
    {isProf?<button onClick={()=>navTo("dashboard")} style={navBtnStyle(page==="dashboard")}>📊 Suivi</button>:null}
    {isProf?<button onClick={()=>navTo("create-exo")} style={navBtnStyle(page==="create-exo")}>➕ Créer exo</button>:null}
    <span title={dbOnline?"Supabase connecté — temps réel actif":"Mode hors-ligne (localStorage)"} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:dbOnline?"#f0fdf4":"#fafafa",border:"1px solid "+(dbOnline?"#bbf7d0":"#e2e8f0"),color:dbOnline?"#16a34a":"#94a3b8",cursor:"default",flexShrink:0}}><span style={{width:7,height:7,borderRadius:"50%",background:dbOnline?"#22c55e":"#cbd5e1",display:"inline-block",boxShadow:dbOnline?"0 0 0 2px #dcfce7":""}} />{dbOnline?"Sync":"Local"}</span>
    <button onClick={()=>{stopT();setUser(null);setPage("home");}} style={{...navBtnStyle(false),flex:"0 0 auto",color:"#ef4444"}}>🚪</button>
  </div>;

  // ═══ CHATBOT ══════════════════════════════════════════════
  if(page==="chatbot")return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    <Sec style={{height:"55vh",overflowY:"auto",padding:16}}>
      <div ref={chatRef} style={{display:"flex",flexDirection:"column",gap:10,height:"100%",overflowY:"auto"}}>
      {aiMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:16,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",background:m.role==="user"?"#6366f1":"white",border:"1px solid "+(m.role==="user"?"#818cf8":"#e2e8f0"),color:m.role==="user"?"white":"#1e293b"}}>{m.content}</div></div>)}
      {aiLoading?<div style={{padding:"12px 16px",borderRadius:16,background:"white",border:"1px solid #e2e8f0",color:"#64748b",fontSize:14,alignSelf:"flex-start"}}>⏳ Je réfléchis...</div>:null}
      </div>
    </Sec>
    <div style={{display:"flex",gap:10,marginTop:8}}><input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();sendAi();}}} placeholder="Pose ta question de maths..." style={{...inputBase,flex:1}} /><button onClick={sendAi} style={{...btnBase,background:"#6366f1",color:"white",borderColor:"#6366f1"}}>Envoyer</button></div>
    <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>{["Explique la récurrence","C'est quoi une forme indéterminée ?","Aide-moi avec les intégrales"].map((q,i)=><button key={i} onClick={()=>setAiInput(q)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #e2e8f0",background:"white",color:"#64748b",fontSize:12,cursor:"pointer"}}>{q}</button>)}</div>
  </div></div>);

  // ═══ INBOX ════════════════════════════════════════════════
  if(page==="inbox")return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    <Sec style={{height:"50vh",overflowY:"auto"}}>
      {msgs.length===0?<p style={{textAlign:"center",color:"#94a3b8",padding:40}}>Aucun message.</p>:null}
      {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from===user.role?"flex-end":"flex-start",marginBottom:8}}><div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:14,fontSize:14,lineHeight:1.6,background:m.from==="prof"?"#eef2ff":"#f0fdf4",border:"1px solid "+(m.from==="prof"?"#a5b4fc":"#bbf7d0"),color:"#1e293b"}}><div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{m.from==="prof"?"👨‍🏫 "+CONFIG.prof.name:"🎓 "+CONFIG.eleve.name} · {new Date(m.ts).toLocaleString("fr")}</div>{m.text}</div></div>)}
    </Sec>
    <div style={{display:"flex",gap:10,marginTop:8}}><input value={msgDraft} onChange={e=>setMsgDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMsg();}} placeholder="Écrire un message..." style={{...inputBase,flex:1}} /><button onClick={sendMsg} style={{...btnBase,background:"#22c55e",color:"white",borderColor:"#22c55e"}}>Envoyer</button></div>
  </div></div>);

  // ═══ FILES ════════════════════════════════════════════════
  if(page==="files")return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    <Sec>
      <p style={{fontSize:14,color:"#4f46e5",fontWeight:600,marginBottom:12}}>{isProf?"Fichiers déposés par "+CONFIG.eleve.name:"Dépose tes copies ici"}</p>
      {!isProf?<><input value={fileComment} onChange={e=>setFileComment(e.target.value)} placeholder="Commentaire (ex: DM3 Suites)..." style={{...inputBase,marginBottom:10}} /><input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} style={{display:"none"}} /><button onClick={()=>fileRef.current?.click()} style={{...btnBase,background:"#6366f1",color:"white",borderColor:"#6366f1",width:"100%",justifyContent:"center"}}>📤 Choisir un fichier</button></>:null}
    </Sec>
    {files.length===0?<Sec><p style={{textAlign:"center",color:"#94a3b8",padding:20}}>Aucun fichier.</p></Sec>:null}
    {files.map((f,i)=><Sec key={i}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><strong>{f.name}</strong><span style={{fontSize:12,color:"#94a3b8",marginLeft:10}}>{Math.round(f.size/1024)}Ko</span></div><Badge color={f.from==="prof"?"#6366f1":"#22c55e"} s>{f.from==="prof"?CONFIG.prof.name:CONFIG.eleve.name}</Badge></div>
      {f.comment?<div style={{fontSize:12,color:"#64748b",marginBottom:8}}>📝 {f.comment}</div>:null}
      {f.type?.startsWith("image/")?<img src={f.data} alt={f.name} style={{maxWidth:"100%",maxHeight:300,borderRadius:12,border:"1px solid #e2e8f0",marginBottom:8}} />:null}
      {f.feedback?<div style={{padding:"10px 14px",borderRadius:12,background:"#eef2ff",border:"1px solid #c7d2fe",fontSize:13,color:"#4f46e5",marginTop:8}}>👨‍🏫 <strong>Retour :</strong> {f.feedback}</div>:null}
      {isProf&&!f.feedback?(fbIdx===i?<div style={{display:"flex",gap:8,marginTop:8}}><input value={fbText} onChange={e=>setFbText(e.target.value)} placeholder="Votre retour..." style={{...inputBase,flex:1}} /><button onClick={()=>{addFb(i,fbText);setFbIdx(null);setFbText("");}} style={{...btnBase,background:"#6366f1",color:"white"}}>✓</button></div>:<button onClick={()=>setFbIdx(i)} style={{...btnBase,marginTop:8,fontSize:13}}>✍️ Retour</button>):null}
    </Sec>)}
  </div></div>);

  // ═══ CREATE EXO ═══════════════════════════════════════════
  if(page==="create-exo"&&isProf)return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    <Sec>
      <h3 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>➕ Créer un exercice</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <select value={exoForm.chapter} onChange={e=>setExoForm({...exoForm,chapter:e.target.value})} style={{...inputBase}}><option value="">-- Chapitre --</option>{CHAPTERS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}</select>
        <input value={exoForm.title} onChange={e=>setExoForm({...exoForm,title:e.target.value})} placeholder="Titre (ex: BAC Métropole 2024)" style={inputBase} />
        <textarea value={exoForm.statement} onChange={e=>setExoForm({...exoForm,statement:e.target.value})} placeholder="Énoncé (optionnel si fichier joint)" style={{...inputBase,minHeight:80,resize:"vertical"}} />
        <div><input ref={exoFileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleExoFile} style={{display:"none"}} /><div style={{display:"flex",gap:10,alignItems:"center"}}><button onClick={()=>exoFileRef.current?.click()} style={{...btnBase,fontSize:13}}>📤 Joindre PDF/Image</button>{exoForm.fileName?<span style={{fontSize:13,color:"#22c55e",fontWeight:600}}>✓ {exoForm.fileName}</span>:null}</div>{exoForm.file&&exoForm.fileType?.startsWith("image/")?<img src={exoForm.file} alt="Aperçu" style={{maxWidth:"100%",maxHeight:200,borderRadius:12,marginTop:10,border:"1px solid #e2e8f0"}} />:null}</div>
        <input value={exoForm.hint} onChange={e=>setExoForm({...exoForm,hint:e.target.value})} placeholder="Indice (optionnel)" style={inputBase} />
        <textarea value={exoForm.solution} onChange={e=>setExoForm({...exoForm,solution:e.target.value})} placeholder="Solution (optionnel)" style={{...inputBase,minHeight:60,resize:"vertical"}} />
        <button onClick={saveExo} style={{...btnBase,background:"#6366f1",color:"white",borderColor:"#6366f1",justifyContent:"center",width:"100%",padding:14}}>💾 Enregistrer</button>
      </div>
    </Sec>
    {Object.entries(customExos).filter(([_,e])=>e?.length>0).map(([id,exos])=>{const c=CHAPTERS.find(x=>x.id===id);return <Sec key={id}><div style={{fontSize:14,fontWeight:700,color:c?.color||"#6366f1",marginBottom:8}}>{c?.icon} {c?.title}</div>{exos.map((ex,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:4,borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0"}}><span style={{flex:1,fontSize:13}}><strong>{ex.title}</strong>{ex.file?" 📎":""}</span><button onClick={()=>delExo(id,i)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,color:"#ef4444"}}>🗑</button></div>)}</Sec>;})}
  </div></div>);

  // ═══ DASHBOARD ═════════════════════════════════════════════
  if(page==="dashboard"&&isProf)return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
      <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:30,fontWeight:800,color:"#6366f1"}}>{stats.a}/{CHAPTERS.length}</div><div style={{fontSize:12,color:"#64748b"}}>Tentés</div></Sec>
      <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:30,fontWeight:800,color:"#22c55e"}}>{stats.m}</div><div style={{fontSize:12,color:"#64748b"}}>≥80%</div></Sec>
      <Sec style={{textAlign:"center",marginBottom:0}}><Ring p={stats.avg} sz={52} sw={5}/><div style={{fontSize:12,color:"#64748b",marginTop:4}}>Moyenne</div></Sec>
      <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:30,fontWeight:800,color:"#f59e0b"}}>{fmtTime(totalTime)}</div><div style={{fontSize:12,color:"#64748b"}}>Temps total</div></Sec>
      <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:30,fontWeight:800,color:"#22c55e"}}>{streak}🔥</div><div style={{fontSize:12,color:"#64748b"}}>Streak</div></Sec>
    </div>
    <Sec>
      <h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>📊 Détail — {CONFIG.eleve.name}</h3>
      {CHAPTERS.map(c=>{const p=prog[c.id],t=timeSpent[c.id]||0;return <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:4,borderRadius:10,background:"#fafbfc",border:"1px solid #e2e8f0",fontSize:13}}>
        <span style={{width:28,height:28,borderRadius:8,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{c.icon}</span>
        <span style={{flex:1,fontWeight:600}}>{c.title}</span>
        {p?.n>0?<><span style={{padding:"2px 8px",borderRadius:12,background:(p.best>=80?"#22c55e":p.best>=50?"#f59e0b":"#ef4444")+"18",color:p.best>=80?"#22c55e":p.best>=50?"#f59e0b":"#ef4444",fontWeight:700,fontSize:12}}>{p.best}%</span><span style={{color:"#64748b",fontSize:11,minWidth:50}}>{p.n}x</span></>:<span style={{color:"#d1d5db",fontSize:12}}>—</span>}
        <span style={{color:"#64748b",fontSize:11,minWidth:50}}>{t>0?fmtTime(t):"—"}</span>
      </div>;})}
    </Sec>
  </div></div>);

  // ═══ HOME ═════════════════════════════════════════════════
  if(page==="home")return(<div style={appBg}><div style={ctrStyle}>{welcome}{nav}
    {/* Search */}
    <div style={{position:"relative",marginBottom:16}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un chapitre, une notion..." style={{...inputBase,fontSize:15}} />
      {search&&searchRes.length>0?<div style={{position:"absolute",top:"100%",left:0,right:0,background:"white",border:"1px solid #e2e8f0",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.1)",zIndex:100,maxHeight:300,overflowY:"auto",marginTop:4}}>{searchRes.map(c=><div key={c.id} onClick={()=>{openCh(c);setSearch("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid #f1f5f9"}}><span style={{width:28,height:28,borderRadius:8,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{c.icon}</span><span style={{fontWeight:600}}>{c.title}</span></div>)}</div>:null}
    </div>

    {/* Stats */}
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <Sec style={{flex:1,minWidth:200,textAlign:"center",marginBottom:0}}><div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"center"}}>{[{v:stats.a+"/"+CHAPTERS.length,l:"Tentés"},{v:String(stats.m),l:"≥80%"}].map((s,i)=><div key={i}><div style={{fontSize:22,fontWeight:800,color:"#6366f1"}}>{s.v}</div><div style={{fontSize:11,color:"#64748b"}}>{s.l}</div></div>)}<Ring p={stats.avg} sz={48} sw={4}/></div></Sec>
      <Sec style={{flex:"0 0 auto",minWidth:100,textAlign:"center",marginBottom:0}}><div style={{fontSize:30,fontWeight:800,color:streak>=3?"#22c55e":"#6366f1"}}>{streak}🔥</div><div style={{fontSize:11,color:"#64748b"}}>streak</div></Sec>
    </div>

    {/* Next step */}
    {!isProf&&nextStep?<Sec style={{background:"linear-gradient(135deg,#eef2ff,#faf5ff)",border:"1px solid #c7d2fe"}}><h3 style={{margin:"0 0 8px",fontSize:15,fontWeight:700,color:"#4f46e5"}}>🎯 Suggestion — Étape {nextStep.step}</h3>{(()=>{const c=CHAPTERS.find(x=>x.id===nextStep.id);return c?<div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:12,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800}}>{c.icon}</div><div style={{flex:1}}><div style={{fontWeight:700}}>{c.title}</div><div style={{fontSize:12,color:"#64748b"}}>Score : {prog[c.id]?.best||0}%</div></div><button onClick={()=>openCh(c)} style={{...btnBase,background:c.color,color:"white",borderColor:c.color,fontSize:13}}>Commencer →</button></div>:null;})()}{nextStep.prerequis1ere?<div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:"#fffbeb",border:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>⚠️ <strong>Prérequis 1ère :</strong> {nextStep.prerequis1ere}{nextStep.prerequisLink?<span> — <a href={nextStep.prerequisLink} target="_blank" rel="noopener noreferrer" style={{color:"#d97706",fontWeight:600}}>Revoir ↗</a></span>:null}</div>:null}</Sec>:null}

    {/* Goals */}
    {weekGoals.length>0||isProf?<Sec><h3 style={{margin:"0 0 10px",fontSize:15,fontWeight:700}}>📅 Objectifs semaine{!isProf&&weekGoals.length>0?" ("+weekGoals.filter(g=>g.done).length+"/"+weekGoals.length+")":""}</h3>{weekGoals.map((g,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:4,borderRadius:10,background:g.done?"#f0fdf4":"white",border:"1px solid "+(g.done?"#bbf7d0":"#e2e8f0")}}><button onClick={()=>toggleGoal(i)} style={{width:22,height:22,borderRadius:6,border:"2px solid "+(g.done?"#22c55e":"#d1d5db"),background:g.done?"#22c55e":"white",cursor:"pointer",color:"white",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{g.done?"✓":""}</button><span style={{flex:1,fontSize:13,color:g.done?"#16a34a":"#334155",textDecoration:g.done?"line-through":"none"}}>{g.text}</span>{isProf?<button onClick={()=>delGoal(i)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11,color:"#ef4444"}}>✕</button>:null}</div>)}{isProf?<div style={{display:"flex",gap:8,marginTop:10}}><input value={goalDraft} onChange={e=>setGoalDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addGoal();}} placeholder="Nouvel objectif..." style={{...inputBase,flex:1,fontSize:13}} /><button onClick={addGoal} style={{...btnBase,background:"#6366f1",color:"white",fontSize:13}}>Ajouter</button></div>:null}</Sec>:null}

    {/* Filters */}
    <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
      {["all",...THEMES].map(t=>{const c=t==="all"?"#6366f1":TC[t];return <button key={t} onClick={()=>setFilt(t)} style={{padding:"7px 16px",border:"1.5px solid "+(filt===t?c:"#e2e8f0"),borderRadius:24,cursor:"pointer",fontSize:12,fontWeight:600,background:filt===t?c+"18":"white",color:filt===t?c:"#64748b"}}>{t==="all"?"Tous":t}</button>;})}
    </div>

    {/* Grid */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
      {list.map(c=>{const p=prog[c.id]||{best:0,n:0},tv=(c.methodVideos?.length||0)+(c.exerciseVideos?.length||0)+(c.demoVideos?.length||0),ce=customExos[c.id]?.length||0,t=timeSpent[c.id]||0,pi=PATH_MAP[c.id];return(
        <div key={c.id} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:18,padding:20,cursor:"pointer",transition:"all .3s",position:"relative",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}} onClick={()=>openCh(c)}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+c.color+",transparent)"}} />
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{width:46,height:46,borderRadius:14,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,border:"1.5px solid "+c.color+"44"}}>{c.icon}</div><Ring p={p.best} sz={36} sw={3} c={c.color}/></div>
          <h3 style={{margin:"8px 0 5px",fontSize:16,fontWeight:700,color:"#0f172a"}}>{c.title}</h3>
          <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge color={TC[c.theme]} s>{c.theme}</Badge>{pi?<span style={{fontSize:10,color:"#94a3b8"}}>Étape {pi.step}</span>:null}</div>
          <div style={{marginTop:10,fontSize:11,color:"#64748b"}}>{c.quiz.length} quiz · {c.exercises.length+ce} exos · {tv} vidéos{t>0?" · "+fmtTime(t):""}</div>
          {p.n>0?<div style={{marginTop:4,fontSize:11}}><strong style={{color:p.best>=80?"#22c55e":p.best>=50?"#f59e0b":"#ef4444"}}>{p.best}%</strong> <span style={{color:"#94a3b8"}}>meilleur</span></div>:null}
        </div>
      );})}
    </div>
  </div></div>);

  // ═══ CHAPTER ══════════════════════════════════════════════
  if(!ch)return null;
  const qs=qDone?ch.quiz.reduce((s,q,i)=>s+(qa[i]===q.answer?1:0),0):null;
  const cats=[...new Set(ch.methodVideos.map(v=>v.cat))];
  const allExos=[...ch.exercises,...(customExos[ch.id]||[])];

  return(<div style={appBg}><div style={ctrStyle}>{nav}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}><button onClick={goHome} style={btnBase}>← Retour</button><div style={{flex:1}} /><Badge color={TC[ch.theme]}>{ch.theme}</Badge></div>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
      <div style={{width:48,height:48,borderRadius:14,background:ch.color+"15",color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,border:"1.5px solid "+ch.color+"44"}}>{ch.icon}</div>
      <div><h2 style={{margin:0,fontSize:24,fontWeight:800,color:"#0f172a"}}>{ch.title}</h2><p style={{margin:"2px 0 0",fontSize:13,color:"#64748b"}}>{ch.methodVideos.length+(ch.exerciseVideos?.length||0)+(ch.demoVideos?.length||0)} vidéos · {ch.quiz.length} quiz · {allExos.length} exos</p></div>
    </div>
    <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"1px solid #e2e8f0",overflowX:"auto"}}>
      {[["cours","📖","Cours"],["formules","📐","Formules"],["quiz","✅","Quiz"],["exercices","✏️","Exercices ("+allExos.length+")"]].map(([k,ic,lb])=><button key={k} onClick={()=>{setTab(k);if(k==="quiz"&&!qDone){setQa({});setQIdx(0);}}} style={{padding:"10px 18px",border:"none",borderRadius:12,cursor:"pointer",background:tab===k?"#6366f1":"transparent",color:tab===k?"white":"#64748b",fontWeight:tab===k?700:500,fontSize:14,display:"flex",alignItems:"center",gap:6,borderBottom:tab===k?"2px solid #6366f1":"2px solid transparent",whiteSpace:"nowrap"}}><span style={{fontSize:15}}>{ic}</span>{lb}</button>)}
    </div>

    {tab==="cours"&&<div>
      <Sec><h3 style={{margin:"0 0 14px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>Notions clés</h3>{ch.sections.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:4,borderRadius:11,background:"#fafbfc",border:"1px solid #e2e8f0"}}><span style={{width:26,height:26,borderRadius:8,background:ch.color+"15",color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span><span style={{fontSize:13,fontWeight:500}}>{s}</span></div>)}</Sec>
      <Sec><h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>📄 Cours</h3><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}><a href={ch.metLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:12,textDecoration:"none",background:ch.color+"18",color:ch.color,border:"1.5px solid "+ch.color+"44",fontSize:13,fontWeight:600}}>🔗 Chapitre sur le site</a><a href={ch.courseVideo} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:12,textDecoration:"none",background:"#ef444418",color:"#ef4444",border:"1.5px solid #ef444444",fontSize:13,fontWeight:600}}>▶️ Cours vidéo</a></div>{ch.coursePdf?.length>0?<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ch.coursePdf.map((pdf,i)=><a key={i} href={pdf} target="_blank" rel="noopener noreferrer" style={{padding:"7px 12px",borderRadius:10,textDecoration:"none",background:"#f8fafc",color:"#64748b",border:"1px solid #e2e8f0",fontSize:12,fontWeight:600}}>📥 PDF{ch.coursePdf.length>1?" ("+(i+1)+")":""}</a>)}</div>:null}</Sec>
      <Sec><h3 style={{margin:"0 0 12px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>🎬 Méthodes ({ch.methodVideos.length})</h3>{cats.map(cat=><div key={cat} style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:ch.color,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>{cat}</div>{ch.methodVideos.filter(v=>v.cat===cat).map((v,i)=><VLink key={i} v={v} />)}</div>)}</Sec>
      {ch.demoVideos?.length>0?<Sec><h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:700,color:"#f59e0b"}}>📜 Démonstrations</h3>{ch.demoVideos.map((v,i)=><VLink key={i} v={v} bg="#fffbeb" />)}</Sec>:null}
      {ch.exerciseVideos?.length>0?<Sec><h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:700,color:"#22c55e"}}>📝 Exercices vidéo</h3>{ch.exerciseVideos.map((v,i)=><VLink key={i} v={v} bg="#f0fdf4" />)}</Sec>:null}
    </div>}

    {tab==="formules"&&<Sec><h3 style={{margin:"0 0 14px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>Formules</h3>{ch.keyFormulas.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",marginBottom:7,borderRadius:12,background:"#fafbfc",border:"1px solid #e2e8f0"}}><span style={{fontSize:13,fontWeight:600,color:"#64748b"}}>{f.name}</span><span style={{fontSize:15,fontWeight:700,color:ch.color,fontFamily:"'Cambria Math',Georgia,serif"}}>{f.formula}</span></div>)}</Sec>}

    {tab==="quiz"&&<div>{!qDone?<>
      <div style={{display:"flex",gap:4,marginBottom:18}}>{ch.quiz.map((_,i)=><div key={i} onClick={()=>setQIdx(i)} style={{flex:1,height:4,borderRadius:2,cursor:"pointer",background:qa[i]!==undefined?ch.color:i===qIdx?ch.color+"66":"#e2e8f0"}} />)}</div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>Question {qIdx+1}/{ch.quiz.length}</div>
      <Sec><p style={{fontSize:15,fontWeight:600,marginBottom:18,lineHeight:1.6}}>{ch.quiz[qIdx].q}</p>{ch.quiz[qIdx].choices.map((c,ci)=><button key={ci} style={qoStyle(qa[qIdx]===ci,false,false,false)} onClick={()=>setQa(p=>({...p,[qIdx]:ci}))}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:7,marginRight:9,background:qa[qIdx]===ci?ch.color+"22":"#f1f5f9",color:qa[qIdx]===ci?ch.color:"#64748b",fontSize:11,fontWeight:700}}>{String.fromCharCode(65+ci)}</span>{c}</button>)}</Sec>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
        <button onClick={()=>setQIdx(Math.max(0,qIdx-1))} disabled={qIdx===0} style={{...btnBase,opacity:qIdx===0?.3:1}}>← Précédent</button>
        {qIdx<ch.quiz.length-1?<button onClick={()=>setQIdx(qIdx+1)} style={{...btnBase,background:ch.color,color:"white",borderColor:ch.color}}>Suivant →</button>:<button onClick={submitQ} disabled={Object.keys(qa).length<ch.quiz.length} style={{...btnBase,background:Object.keys(qa).length<ch.quiz.length?"#f1f5f9":"#22c55e",color:Object.keys(qa).length<ch.quiz.length?"#94a3b8":"white",borderColor:Object.keys(qa).length<ch.quiz.length?"#e2e8f0":"#22c55e",fontWeight:700}}>Valider ✓</button>}
      </div>
    </>:<>
      <Sec style={{textAlign:"center",padding:"28px 20px"}}>
        <Ring p={Math.round(qs/ch.quiz.length*100)} sz={72} sw={6} c={qs/ch.quiz.length>=.8?"#22c55e":qs/ch.quiz.length>=.5?"#f59e0b":"#ef4444"} />
        <h3 style={{margin:"14px 0 4px",fontSize:20,fontWeight:800}}>{qs}/{ch.quiz.length}</h3>
        <p style={{color:"#64748b",fontSize:13}}>{qs===ch.quiz.length?"🎉 Parfait !":qs/ch.quiz.length>=.8?"👏 Très bien !":qs/ch.quiz.length>=.5?"💪 Continue !":"📚 Revois le cours !"}</p>
        <button onClick={()=>{setQa({});setQDone(false);setQIdx(0);}} style={{...btnBase,marginTop:14,background:ch.color,color:"white",borderColor:ch.color}}>🔄 Recommencer</button>
      </Sec>
      {ch.quiz.map((q,i)=>{const ok=qa[i]===q.answer;return <Sec key={i} style={{borderColor:ok?"#bbf7d0":"#fecaca"}}><div style={{display:"flex",gap:8,marginBottom:8}}><span>{ok?"✅":"❌"}</span><span style={{fontWeight:600,fontSize:13}}>Q{i+1}</span></div><p style={{fontSize:13,color:"#334155",marginBottom:7}}>{q.q}</p>{q.choices.map((c,ci)=><div key={ci} style={{...qoStyle(qa[i]===ci,ci===q.answer,qa[i]===ci&&ci!==q.answer,true),cursor:"default"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:7,marginRight:9,background:ci===q.answer?"#dcfce7":qa[i]===ci?"#fee2e2":"#f1f5f9",color:ci===q.answer?"#22c55e":qa[i]===ci?"#ef4444":"#64748b",fontSize:11,fontWeight:700}}>{ci===q.answer?"✓":qa[i]===ci?"✗":String.fromCharCode(65+ci)}</span>{c}</div>)}<div style={{marginTop:10,padding:"10px 14px",borderRadius:11,background:"#eef2ff",border:"1px solid #c7d2fe",fontSize:12,color:"#4338ca",lineHeight:1.6}}>💡 {q.explanation}</div></Sec>;})}
    </>}</div>}

    {tab==="exercices"&&<div>
      {allExos.map((ex,i)=><Sec key={i}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{width:30,height:30,borderRadius:10,background:ch.color+"15",color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800}}>{i+1}</span><h4 style={{margin:0,fontSize:15,fontWeight:700,flex:1}}>{ex.title}</h4>{ex.byProf?<Badge color="#6366f1" s>Prof</Badge>:null}</div>
        <div style={{padding:"14px 16px",borderRadius:12,background:"#fafbfc",border:"1px solid #e2e8f0",fontSize:14,lineHeight:1.7,color:"#334155",marginBottom:10,whiteSpace:"pre-wrap"}}>{ex.statement}</div>
        {ex.file&&ex.fileType?.startsWith("image/")?<img src={ex.file} alt={ex.fileName} style={{maxWidth:"100%",borderRadius:12,border:"1px solid #e2e8f0",marginBottom:10}} />:null}
        {ex.file&&ex.fileType==="application/pdf"?<div style={{marginBottom:10}}><a href={ex.file} download={ex.fileName} style={{...btnBase,background:"#eef2ff",color:"#4f46e5",borderColor:"#c7d2fe",fontSize:13}}>📄 {ex.fileName||"PDF"}</a></div>:null}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {ex.hint?<button onClick={()=>setHints(p=>({...p,[i]:!p[i]}))} style={{...btnBase,fontSize:12,background:hints[i]?"#fffbeb":"white",borderColor:hints[i]?"#fcd34d":"#d1d5db",color:hints[i]?"#b45309":"#64748b"}}>{hints[i]?"🔒 Cacher":"💡 Indice"}</button>:null}
          {ex.solution?<button onClick={()=>setSols(p=>({...p,[i]:!p[i]}))} style={{...btnBase,fontSize:12,background:sols[i]?"#f0fdf4":"white",borderColor:sols[i]?"#86efac":"#d1d5db",color:sols[i]?"#16a34a":"#64748b"}}>{sols[i]?"🔒 Cacher":"🔓 Solution"}</button>:null}
          {isProf&&ex.byProf?<button onClick={()=>delExo(ch.id,i-ch.exercises.length)} style={{...btnBase,fontSize:12,background:"#fef2f2",borderColor:"#fecaca",color:"#ef4444"}}>🗑</button>:null}
        </div>
        {hints[i]&&ex.hint?<div style={{marginTop:10,padding:"12px 16px",borderRadius:12,background:"#fffbeb",border:"1px solid #fde68a",fontSize:13,color:"#92400e",lineHeight:1.6}}>💡 {ex.hint}</div>:null}
        {sols[i]&&ex.solution?<div style={{marginTop:10,padding:"12px 16px",borderRadius:12,background:"#f0fdf4",border:"1px solid #bbf7d0",fontSize:13,color:"#16a34a",lineHeight:1.6}}>✅ {ex.solution}</div>:null}
      </Sec>)}
      {ch.exerciseVideos?.length>0?<Sec><h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:700,color:"#22c55e"}}>📝 Exercices vidéo</h3>{ch.exerciseVideos.map((v,i)=><VLink key={i} v={v} bg="#f0fdf4" />)}</Sec>:null}
      {ch.extraLinks?.length>0?<Sec><h3 style={{margin:"0 0 12px",fontSize:17,fontWeight:700,color:"#4f46e5"}}>🌐 Exercices BAC — autres profs</h3>{ch.extraLinks.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:5,borderRadius:12,background:"#eef2ff",border:"1px solid #c7d2fe",textDecoration:"none",color:"#1e293b",fontSize:13}}><span>{l.icon}</span><span style={{fontWeight:600}}>{l.name}</span><span style={{marginLeft:"auto",color:"#6366f1"}}>→</span></a>)}</Sec>:null}
      <Sec style={{textAlign:"center"}}><a href={ch.metLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:12,textDecoration:"none",background:ch.color+"18",color:ch.color,border:"1.5px solid "+ch.color+"44",fontSize:13,fontWeight:600}}>Exercices sur le site →</a></Sec>
    </div>}
  </div></div>);
}
