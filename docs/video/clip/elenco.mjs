/**
 * Le clip di repertorio usate dal montaggio breve, nell'ordine in cui compaiono.
 *
 * `nome` è come le chiama `pagina/contenuti-breve.js` nel campo `clip`; `slug` è
 * la pagina su Mixkit da cui `scarica.mjs` rilegge la licenza prima di ogni
 * scaricamento. Per sostituire una ripresa si cambiano `id` e `slug` qui e si
 * rilancia `node clip/scarica.mjs`: il resto non si tocca.
 *
 * Sta in un file suo, separato dallo scaricatore, perché lo legge anche
 * `registra.mjs` — e importare lo scaricatore vorrebbe dire farlo partire.
 */

export const CLIP = [
  { nome: 'ufficio',   id: '42617', slug: 'people-working-in-the-office-42617',                                 uso: 'apertura — l’azienda al lavoro' },
  { nome: 'tecnico',   id: '221',   slug: 'reflection-of-a-screen-in-glasses-221',                              uso: 'il problema — lo schermo riflesso negli occhiali' },
  { nome: 'circuito',  id: '1140',  slug: 'microchip-technology-close-up-1140',                                 uso: 'servizi — sistemi e hardware' },
  { nome: 'mani',      id: '4938',  slug: 'hands-of-a-girl-working-on-a-computer-4938',                         uso: 'servizi — helpdesk e assistenza' },
  { nome: 'codice',    id: '50748', slug: 'computer-screens-display-green-text-and-matrix-like-scrolling-50748', uso: 'tecnoSHIELD — cybersicurezza' },
  { nome: 'riunione',  id: '4547',  slug: 'people-having-a-work-meeting-around-a-table-4547',                    uso: 'check-up — il confronto col cliente' },
  { nome: 'openspace', id: '914',   slug: 'open-office-space-914',                                              uso: 'chiusura — i settori che seguiamo' },
];
