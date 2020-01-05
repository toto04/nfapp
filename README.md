# NFApp (nome provvisorio)
Questa è la repo dell'applicazione ufficiale del liceo Nervi Ferrari di Morbegno basata su [React Native](https://facebook.github.io/react-native/)/[Typescript](https://www.typescriptlang.org/) e [React-Redux](https://react-redux.js.org/)

L'applicazione è sviluppata principalmente da Tommaso Morganti e disegnata da Erica Garbellini.

Questo alla fine è un progetto scolastico, quindi anche se non conoscete sta roba date comunque un'occhiata e provate a capire se vi interessa. Se invece le sapete già bene probabilmente sapete più cose di me dato che è la prima volta che uso React.

## Ambiente
Innanzitutto lo dico perché non si sa mai ci vuole [Node.js](https://nodejs.org/it/). Se non avete Node scaricatelo duh, e sarebbe anche meglio se sapeste usare git, sto guardando te Elia.

Venendo alla vera applicazione, è basata su [Expo](https://expo.io/), per cui bisogna installare expo-cli con:

    npm i -g expo-cli

A questo punto potete scaricare la repo

    git clone https://github.com/toto04/nfapp.git

poi installate tutte le dependencies del caso
    
    npm ci

e potete incominciare a fare un po' quello che vi pare. 

Il backend è sviluppato ancora una volta in Typescript e Node, potete trovarlo a <https://github.com/toto04/nfapp-server>. Utilizza un database PostgreSQL per persistenza e expo-server-sdk per la gestione delle notifiche push.

Per quanto riguarda il server comunque potete setuppare un database locale PostgreSQL e mettere le informazioni nel file ```.env```

Ho fatto una cosa simile anche per l'app, il file ```env_example.tsx``` lo rinominate a ```env.tsx``` (metodo stackoverflow approved giuro) e ci infilate dentro l'indirizzo dell'endpoint che state utilizzando in sviluppo.  

Insopmma alla fine per avviare l'applicazione basta il comando

    expo start

Per testare l'applicazione con modifiche in tempo reale dovrete aver installato l'applicazione di Expo su iOS / Android (più varietà di dispositivi meglio è) cercatela sull'app store non ho voglia di mettere il link qui, leggete la loro documentazione insomma ^^

Avrete bisogno di un account, fatevelo, loggatevi nell'applicazione, quando avviate l'applicazione (con il comando ```expo start```), potrete loggarvi anche lì e poi apparirà come per magia la nfapp nel tab "Project" dell'app Expo

____

Per qualsiasi dubbio / domanda / suggerimento contattatemi (Sono Tommaso Morganti di 5ASA btw 😊) o aprite una issue / pull request

ok ciao devo andare a studiare

elia culo