# Debug - Mercado Pago SDK v2

## Possíveis problemas:

1. **Método `createCardToken()` não existe na v2**
   - MP SDK v2 pode usar `mp.cardForm` em vez disso
   - Ou pode precisar de um PaymentForm

2. **BIN não encontrado**
   - Significa que o cartão usado para teste não é válido para esse ambiente
   - Ou o token não está sendo gerado corretamente

## Cartões de teste válidos para MP:
- VISA: `4111111111111111`, `4916338506082832`
- MASTERCARD: `5425233010103291`
- ELO: `6362970000457013`

## Para verificar:
1. Abrir DevTools (F12) no navegador
2. Ir à aba Console
3. Verificar se há erros quando `mp.createCardToken()` é chamado
4. Verificar o objeto retornado do token

## Próximos passos:
Se o método não existir, usar o fluxo correto:
- Usar Security Fields (iframes) do MP para capturar dados
- Ou usar a API REST do MP para criar o token
