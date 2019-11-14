# NFApp
Questa è la repo dell'applicazione ufficiale del liceo Nervi Ferrari di Morbegno basata su [React Native](https://facebook.github.io/react-native/)/[Typescript](https://www.typescriptlang.org/) e [React-Redux](https://react-redux.js.org/)

Questo alla fine è un progetto scolastico, quindi anche se non conoscete sta roba date comunque un'occhiata e provate a capire se vi interessa. Se invece le sapete già bene probabilmente sapete più cose di me dato che è la prima volta che uso React.

## Ambiente
Innanzitutto lo dico perché non si sa mai ci vuole [Node.js](https://nodejs.org/it/). Se non avete Node scaricatelo duh, e sarebbe anche meglio se sapeste usare git, sto guardando te Elia.

Venendo alla vera applicazione, per il momento dato che siamo poveri sto usando [Expo](https://expo.io/) per poter sviluppare in una maniera decentemente rapida, installate expo-cli con:

    npm i -g expo-cli

A questo punto potete scaricare la repo

    git clone https://github.com/toto04/nfapp.git

poi installate tutte le dependencies del caso
    
    npm i

e potete incominciare a fare un po' quello che vi pare. Piccola parentesi per quanto riguarda il server di sviluppo. Questo non è assolutamente una cosa definitiva, trovate il mio codice fatto molto velocemente su <https://github.com/toto04/nfapp-server>. Questo è basato ancora una volta su Typescript perché era la cosa più rapida e userebbe un database PostreSQL locale, probabilmente cambieremo le cose o ci appoggeremo sul server di Elia Pontiggia in produzione.

Per quanto riguarda il server comunque potete setuppare un database locale PostgreSQL e mettere le informazioni nel file ```.env_example``` che andrà rinominato come di consueto a ```.env```

Ho fatto una cosa simile anche per l'app, il file ```env_example.tsx``` lo rinominate a ```env.tsx``` e ci infilate dentro l'indirizzo dell'endpoint che state utilizzando in sviluppo. Potete anche fare roba senza, solo non il Login o cose simili ma se volete solo disegnare componenti fate pure.  

Insopmma alla fine per avviare l'applicazione basta il comando

    expo start

Per testare l'applicazione con modifiche in tempo reale dovrete aver installato l'applicazione di Expo su iOS / Android (più varietà di dispositivi meglio è) cercatela sull'app store non ho voglia di mettere il link qui :)

Avrete bisogno di un account, fatevelo, loggatevi nell'applicazione, quando avviate l'applicazione (con il comando ```expo start```), potrete loggarvi anche lì e poi apparirà come per magia la nfapp nel tab "Project" dell'app Expo

____

Per qualsiasi dubbio / domanda / suggerimento contattatemi (Sono Tommaso Morganti di 5ASA btw 😊) o aprite una issue / pull request

ok ciao devo andare a studiare

elia culo