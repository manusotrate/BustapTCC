# Cartões de Teste - Mercado Pago

## Débito (Teste)

### VISA Débito
- **Número**: 4111111111111111
- **Nome**: APRO
- **Validade**: 11/2025 (ou qualquer data futura)
- **CVV**: 123

### MASTERCARD Débito  
- **Número**: 5425233010103291
- **Nome**: APRO
- **Validade**: 11/2025
- **CVV**: 123

### ELO Débito
- **Número**: 6362970000457013
- **Nome**: APRO
- **Validade**: 11/2025
- **CVV**: 123

## Resultado esperado
- **Resultado APRO**: Pagamento Aprovado
- **Resultado OTHE**: Pagamento Pendente
- **Resultado CALL**: Chamada para autorizar
- **Resultado FUND**: Fundos insuficientes
- **Resultado SECU**: Código de segurança inválido
- **Resultado EXPI**: Data de expiração inválida
- **Resultado FORM**: Erro de formulário

## Importante
- CPF: Qualquer CPF válido (ex: 12345678912 ou 12111111111)
- Nome do titular: APRO para aprovado, ou outro padrão acima

## Se continuar com erro `bin_not_found`
Pode ser:
1. Cartão não é válido para débito (só crédito)
2. Token não foi gerado corretamente
3. Falta o `issuer_id` na requisição

Tente com **4111111111111111** (VISA Débito).
