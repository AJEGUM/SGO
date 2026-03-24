<div align="center">

<img src="https://img.shields.io/badge/SENA-ADSO-39A900?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/Estado-En%20Desarrollo-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/IA-Generativa-8B5CF6?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/Versión-1.0.0-green?style=for-the-badge" />

# 🎓 SGO — Sistema de Gestión de OVAs

### *Ecosistema de Aprendizaje Adaptativo con Inteligencia Artificial Generativa*

> Proyecto del programa **Análisis y Desarrollo de Software (ADSO)** — SENA  
> Período: Febrero 2026 – Junio 2026

</div>

---

## 📌 Descripción General

**SGO (Sistema de Gestión de OVAs)** es una solución tecnológica disruptiva diseñada para el programa ADSO, cuyo propósito es trascender el contenido estático tradicional en la educación técnica. Mediante la integración de **IA Generativa** con arquitectura **RAG (Retrieval-Augmented Generation)**, el sistema no actúa simplemente como un repositorio de información, sino como un **ecosistema de aprendizaje adaptativo** que personaliza la experiencia de cada aprendiz en tiempo real.

El sistema responde a la necesidad de modernizar los procesos de enseñanza-aprendizaje en el SENA, automatizando la carga curricular, la generación de propuestas pedagógicas y la evaluación de evidencias, permitiendo que el instructor se enfoque en el **acompañamiento estratégico**.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar un Objeto Virtual de Aprendizaje (OVA) inteligente y adaptativo, integrado con modelos de lenguaje a gran escala (LLM), que facilite la apropiación de competencias técnicas en el programa ADSO mediante una estructura pedagógica dinámica y automatizada.

### Objetivos Específicos
- 🔍 **Analizar** los niveles de entrada y requerimientos técnicos de los aprendices para orientar el diseño de rutas de aprendizaje personalizadas.
- 🏗️ **Diseñar** la arquitectura de software y el modelo de interacción de la IA generativa con diagramas, prototipos y prompts especializados.
- ⚙️ **Desarrollar** los módulos funcionales de la aplicación e integrar la IA usando frameworks y servicios en la nube.
- ✅ **Validar** el impacto de la herramienta mediante pruebas de usuario con aprendices e instructores y métricas de desempeño técnico.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Web Responsive)            │
│              Sistema de Gestion de OVAs                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                        BACKEND / API                        │
│    Lógica de negocio │ Autenticación │ Control de roles     │
└──────┬──────────────────────────────────────┬───────────────┘
       │                                      │
┌──────▼──────────┐                  ┌────────▼──────────────┐
│   BASE DE DATOS │                  │   MOTOR DE IA (LLM)   │
│      SQL        │◄────────────────►│   Arquitectura RAG    │
│  (Persistencia) │                  │  Contenido + Contexto │
└─────────────────┘                  └───────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────┐
│              ALMACENAMIENTO EN LA NUBE                      │
│         Evidencias │ Archivos │ Assets pedagógicos           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Área | Tecnología |
|------|-----------|
| **Frontend** | Angular - Tailwind CSS |
| **Backend** | NodeJS - Express |
| **Base de Datos** | SQL |
| **IA / LLM** | Gemini — Arquitectura RAG |
| **Infraestructura** | Servidor propio + Free Tiers en la nube (Cloudflare) |
| **CI/CD** | GitHub Actions - Docker |

---

## 👥 Equipo

| Rol | Nombre |
|-----|--------|
| 👨‍🏫 **Instructor / Cliente** | Freddy Otoniel Sierra |
| 👨‍💻 **Desarrollador** | Anderson Castrillón |
| 👨‍💻 **Desarrollador** | Julian Guevara |

---

## 📅 Cronograma

| Hito | Fecha |
|------|-------|
| 🚀 Inicio del proyecto | 2 de Febrero de 2026 |
| 🏁 Entrega final | 27 de Junio de 2026 |

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del programa de formación **Análisis y Desarrollo de Software (ADSO)** del **SENA**. Su uso es de carácter académico e institucional.

---

<div align="center">

Hecho con ❤️ por el equipo SGO — SENA ADSO · 2026

</div>
