const fs = require('fs');
const path = 'C:/Users/joao.butzen/Documents/Arvum-site/SPEC.md';
let src = fs.readFileSync(path, 'utf8');

const old = '**Mudanças:** Sem alterações necessárias, endpoints estão alinhados.\r\n\r\n### Estrutura de Dados (DTOs)';
const newP = '**Mudanças:** Sem alterações necessárias, endpoints estão alinhados.\r\n' +
    '\r\n' +
    '**Nova estrutura de retorno (`/thinking/indicadores`):** A API agora retorna um objeto contendo `pensamentos` (array de strings), `reducoes` e `exclusoes` (cada item com `gastoId`, `nome`, `valorAtual`, `valorSugerido`) e `comparativo` (com `renda`, `gastos`, `gastosFixos`, `gastosVariaveis`, `saldoPositivo`, `razaoGastosRenda` e uma `mensagem` contextualizada). O frontend consome esses campos diretamente para exibir o card comparativo de gastos x renda e as sugestões personalizadas.\r\n' +
    '### Estrutura de Dados (DTOs)';

const idx = src.indexOf(old);
console.log('idx thinking section:', idx);
if (idx === -1) {
    console.log('padrao thinking nao encontrado');
    process.exit(1);
}
src = src.substring(0, idx) + newP + src.substring(idx + old.length);
fs.writeFileSync(path, src);
console.log('SPEC frontend thinking section atualizada');
