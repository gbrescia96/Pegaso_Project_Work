# Project Work: L.A.B. : Laboratorio Analisi dr. Brescia
Traccia 1.4

## Requisiti
Per il corretto funzionamento del progetto è necessario installare l'interprete Python e Flask, un web server gratuito ed estremamente leggero.
Per preparare l'ambiente è necessario eseguire i seguenti passi:
- Installare Python versione uguale o superiore **3.12.x** visitando [il sito ufficiale Python](https://www.python.org/downloads/)
- Installare Flask e l'estensione Flask CORS per la gestione delle richieste al web server locale. Aprire il Prompt dei Comandi (CMD) e digitare:
  ```
  pip install flask;
  pip install flask-cors;
  ```
Questo utilizzerà il gestore di installazioni Python (PIP) per installare correttamente le librerie indicate.

Infine, è necessario avviare il Web Server che, di default, resterà il ascolto sulla porta 5000 in locale.
Aprire il Prompt dei Comandi (CMD) nella sottocartella \Sorgente\Backend e digitare:
 ```
  python.exe .\endpoints.py
 ```
Se tutto è stato configurato correttamente l'esito sarà simile al seguente.
![image](https://github.com/user-attachments/assets/9d731b6c-5e67-45ef-a3eb-60d878242cf3)

## Librerie incluse nel progetto
Il progetto fa uso di librerie esterne per la gestione di alcune funzionalità lato Front-End quali il sistema di notifiche, le tabelle di DataTable e la gestione del layout tramite grid e componenti offerti da Bootstrap.
**Queste librerie sono già incluse nel progetto e non richiedono alcun download aggiuntivo**. Di seguito i sorgenti per qualsiasi necessità:
- [JQuery v. 3.7.1](https://jquery.com/download/)
- [Bootstrap v. 5.3.3](https://getbootstrap.com/docs/5.3/getting-started/download/)
- [FontAwesome v. 6.5.2 (Free Release)](https://fontawesome.com/start)
- [DataTable v. 2.1.0](https://datatables.net/download/)
- [PNotify + Bright Theme v. 5.2.0](https://github.com/sciactive/pnotify/blob/master/README.md)

## Dati di test
È possibile utilizzare i seguenti dati per testare le funzionalità dell'applicazione:
- Codice fiscale: ABCDEF01A01A123A
- Codice tessera sanitaria: 80380001101234567890

## Note
- La libreria DataTable è stata modificata nel file DataTable.js per visualizzare i messaggi in italiano senza dover utilizzare l'override della configurazione di default. Di seguito i punti variati:
  ```
  //Label presente nel campo di filtro post-generazione DataTable
  "sSearch": "Filtra:"
  //Label presente nella tabella generata se il filtro non ha prodotto risultati
  "sZeroRecords": "Nessun risultato corrispondente ai filtri"
  //Label presente nella tabella generata se non contiene alcun record
  "sEmptyTable": "Nessun risultato trovato"
  ``` 
 
