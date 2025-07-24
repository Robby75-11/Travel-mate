# ✈️ Travel Mate

**Travel Mate** è un'applicazione full-stack per la prenotazione di **hotel, viaggi, crociere e voli**, con gestione completa da pannello **admin back-office**. Include autenticazione JWT, sistema di recensioni, gestione utenti che loggati possono fare prenotazioni,scrivere recensioni e verificare le proprie prenotazioni. L'amministratore
puo caricare con Cloudinary più immagini , modificare hotel/viaggi/voli, cancellare prenotazioni, recensioni e invio email di conferma prenotazione quando aggiorna lo stato da IN ATTESA A CONFERMATA.

🌐 **Versione online**: https://travel-mate-sand.vercel.app
Backend: https://travel-mate-backend-production-b35c.up.railway.app

File vercel.json: Serve per le Single Page Application (SPA) dove il routing è gestito dal frontend. Senza questo rewrite:

Se c'è /viaggi/123 direttamente nel browser (es. ricarico la pagina), Vercel cerca un file /viaggi/123.html e restituisce 404.

Con il rewrite:

Tutte le richieste vengono reindirizzate a / → l'app React/Vite può leggere la route ed eseguire il render corretto tramite react-router-dom.

---Interfaccia responsive.

## 🧑‍💻 Tecnologie utilizzate

- **Frontend**: React, Vite, Bootstrap, Axios
- **Backend**: Spring Boot, PostgreSQL, Spring Security
- **Test**: JUnit (backend)
  Testato con Postman tutti gli end-point.

---

## 📦 Struttura del progetto

Il progetto è suddiviso in due repository:

- **Frontend**: `Travel-mate`
- **Backend**: `Travel-mate-backend`

Alla consegna ci saranno 2 repository una per il front end che caricherò nel form della consegna su pagina epicode,

e l'altra back-end il cui link sarà in questo file README.md.

Repository Back-end :https://github.com/Robby75-11/Travel-mate-backend

cd Travel-mate

## ▶️ Avvio del progetto

### 📁 Frontend (Travel-mate)

# Installa le dipendenze

npm install

# Avvia il server di sviluppo

npm run dev

Backend : avvio il server di Intellij

Progetto "Capstone 2025" Di Roberto Albergo
