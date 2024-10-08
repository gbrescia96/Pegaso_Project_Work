# Project Work: L.A.B. : Laboratorio Analisi dr. Brescia
Traccia 1.4

## Requisiti
Per il corretto funzionamento del progetto è necessario installare l'interprete Python e Flask, un web server gratuito ed estremamente leggero.
Per preparare l'ambiente è necessario eseguire i seguenti passi:
- Scaricare il progetto tramite il pulsante verde in alto a destra "Code" e, nella tendina aperta, selezionare Download .zip.
 ![image](https://github.com/user-attachments/assets/b8b3790e-c806-49e5-9c96-7eaec5b2d58f)

- Estrarre il progetto tramite WinZip, WinRar, 7z o qualunque altro software per la decompressione di archivi
- Installare Python con versione uguale o superiore a **3.12.x** visitando [il sito ufficiale Python](https://www.python.org/downloads/)
  - **IMPORTANTE:** nella schermata di installazione spuntare le ultime due caselle relative ai diritti di Admin e all'aggiunta di python alle variabili d'ambiente:
    ![image](https://github.com/user-attachments/assets/a9d2dffe-e18b-43fb-8470-a2ad0428121f)
- Cliccare su Install Now e attendere la fine dell'installazione
- Aprire il Prompt dei Comandi (CMD)
- Installare Flask digitando il codice seguente e premendo "invio":
    ```
  pip install flask;
    ```
- Installare Flask-cors digitando il codice seguente e premendo "invio":
    ```
  pip install flask-cors;
    ```


Ora è necessario avviare il Web Server che, di default, resterà il ascolto sulla porta 5000 in locale e successivamente aprire una pagina html tra quelle disponibili nel Frontend. Ci sono due modi per farlo:
- Metodo 1: lanciare il file **\Sorgente\start_project.bat** che eseguirà automaticamente l'avvio del Web Server e l'apertura, tramite browser default, della pagina Homepage.
- Metodo 2: tramite il Prompt dei Comandi (CMD), eseguire nella sottocartella **\Sorgente\Backend** il seguente codice e successivamente aprire con un browser qualsiasi una pagina html tra quelle presenti nella cartella **Sorgente\Frontend**:
 ```
  python.exe .\endpoints.py
 ```

In entrambi i casi, se tutto è stato configurato correttamente il prompt dei comandi visualizzerà il Web Server in ascolto.

![image](https://github.com/user-attachments/assets/9d731b6c-5e67-45ef-a3eb-60d878242cf3)
*Nota: il pin è randomico.*

Da ora è possibile utilizzare l'applicativo.

## Dati di test
È possibile utilizzare i seguenti dati per testare le funzionalità di ricerca, aggiunta e modifica delle prenotazioni su due record di test già presenti:
- Codice fiscale: ABCDEF01A01A123A
- Codice tessera sanitaria: 80380001101234567890

In questo modo eviterete di dover inserire i vostri dati reali.

## Librerie incluse nel progetto
Il progetto fa uso di librerie esterne per la gestione di alcune funzionalità lato Front-End quali il sistema di notifiche, le tabelle di DataTable e la gestione del layout tramite grid e componenti offerti da Bootstrap.
**Queste librerie sono già incluse nel progetto e non richiedono alcun download aggiuntivo**. Di seguito i sorgenti per qualsiasi necessità:
- [JQuery v. 3.7.1](https://jquery.com/download/)
- [Bootstrap v. 5.3.3](https://getbootstrap.com/docs/5.3/getting-started/download/)
- [FontAwesome v. 6.5.2 (Free Release)](https://fontawesome.com/start)
- [DataTable v. 2.1.0](https://datatables.net/download/)
- [PNotify + Bright Theme v. 5.2.0](https://github.com/sciactive/pnotify/blob/master/README.md)

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
 
