export const connectorCopy={fr:{
 falKeyHint:'Utilisez une clé fal avec la permission billing:usage:read, par exemple le préréglage READONLY.',apiCostDelayedInfo:'Dépense API de l’organisation sur les jours finalisés du mois UTC, jusqu’à hier. Ce montant n’inclut pas encore la journée en cours et n’est pas un solde.',
 getApiKey:'Obtenir une clé chez le fournisseur',
 adminKeyHint:'Cette lecture nécessite une clé administrateur de votre organisation API. Elle ne lit pas votre abonnement ChatGPT ou Claude Code.',apiCostInfo:'Dépense API de l’organisation depuis le début du mois UTC. Ce montant n’est pas un quota restant ni le coût d’un abonnement chat.',
 apiKey:'Clé API',replaceApiKey:'Remplacer la clé API',apiKeySaved:'Clé enregistrée',apiKeyRequired:'Ajoutez votre clé pour lire les données de ce service.',
 apiKeyHint:'Votre clé est chiffrée pour votre session locale et envoyée uniquement à ce fournisseur. Les lectures ne génèrent aucun contenu IA.',
 connectApi:'Connecter et lire',removeApiKey:'Déconnecter et supprimer la clé',apiConnectionFailed:'Connexion impossible. Vérifiez la clé et la disponibilité du chiffrement local.',
 apiKeyRejected:'Clé refusée ou permissions insuffisantes. Remplacez-la dans Connexions.',apiRateLimited:'Le fournisseur limite les lectures. Cypher réessaiera plus tard.',
 apiKeyUnreadable:'Cette clé ne peut pas être déchiffrée sur cette session locale. Saisissez-la à nouveau.',credentialStorageUnavailable:'Le chiffrement local est indisponible. La clé ne sera pas enregistrée.',
 apiBalanceInfo:'Solde renvoyé par le fournisseur. Les abonnements chat et la facturation API peuvent être distincts.',keyBudgetInfo:'Budget de cette clé et dépense API du mois. Ce budget n’est pas le solde du compte.',
 apiBalance:'Solde API',pointsRemaining:'Points disponibles',keyBudgetRemaining:'Budget de la clé',monthlyApiSpend:'Dépense API du mois',points:'points',currency:'',credits:'crédits',
 localOffline:'Le serveur local ne répond pas. Démarrez le serveur du service, puis actualisez.',claudeQuotaSupport:'Connexion disponible. La lecture des quotas Claude reste à développer.',geminiQuotaSupport:'Connexion disponible. La lecture du compte et des quotas Gemini reste à développer.',
 sessionExpired:'La session de ce profil a expiré ou a été refusée. Reconnectez ce profil dans Connexions, puis actualisez.',quotaReadFailed:'Compte reconnu, mais le fournisseur n’a pas renvoyé ses quotas. Réessayez avec Actualiser.',cliTimeout:'Le CLI n’a pas répondu à temps. Réessayez avec Actualiser.'
},en:{
 falKeyHint:'Use a fal key with billing:usage:read permission, for example the READONLY preset.',apiCostDelayedInfo:'API organization spend over finalized days of the UTC month, through yesterday. This excludes the current day and is not a balance.',
 getApiKey:'Get a key from the provider',
 adminKeyHint:'This read requires an API organization admin key. It does not read your ChatGPT or Claude Code subscription.',apiCostInfo:'API organization spend since the start of the UTC month. This is not remaining quota or a chat subscription cost.',
 apiKey:'API key',replaceApiKey:'Replace API key',apiKeySaved:'Key saved',apiKeyRequired:'Add your key to read this service data.',
 apiKeyHint:'Your key is encrypted for your local session and sent only to this provider. Reads do not generate AI content.',
 connectApi:'Connect and read',removeApiKey:'Disconnect and delete key',apiConnectionFailed:'Could not connect. Check your key and local encryption availability.',
 apiKeyRejected:'Key rejected or insufficient permissions. Replace it in Connections.',apiRateLimited:'The provider is limiting reads. Cypher will retry later.',
 apiKeyUnreadable:'This key cannot be decrypted in this local session. Enter it again.',credentialStorageUnavailable:'local encryption is unavailable. The key will not be saved.',
 apiBalanceInfo:'Balance returned by the provider. Chat subscriptions and API billing may be separate.',keyBudgetInfo:'This key budget and monthly API spend. The budget is not your account balance.',
 apiBalance:'API balance',pointsRemaining:'Available points',keyBudgetRemaining:'Key budget',monthlyApiSpend:'Monthly API spend',points:'points',currency:'',credits:'credits',
 localOffline:'The local server is not responding. Start the service server, then refresh.',claudeQuotaSupport:'Sign-in is available. Claude quota collection is still to be implemented.',geminiQuotaSupport:'Sign-in is available. Gemini account and quota collection are still to be implemented.',
 sessionExpired:'This profile session expired or was rejected. Sign in again for this profile in Connections, then refresh.',quotaReadFailed:'Account recognized, but the provider did not return its quotas. Try Refresh again.',cliTimeout:'The CLI did not respond in time. Try Refresh again.'
}};
