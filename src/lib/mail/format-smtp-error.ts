/**
 * Converte erros técnicos de ligação SMTP (nodemailer / Node) em mensagens claras em português.
 */
export function formatSmtpError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const msg = raw.trim();
  if (!msg) {
    return "Falha ao contactar o servidor de e-mail. Verifique o host, a porta e as credenciais.";
  }

  const lower = msg.toLowerCase();

  if (msg.includes("ENETUNREACH") || lower.includes("network unreachable")) {
    return (
      "Não foi possível alcançar o servidor SMTP (rede inacessível). Isto costuma indicar firewall, " +
      "rede sem saída para a Internet, ou resolução DNS para um endereço IPv6 quando o ambiente só tem IPv4. " +
      "Experimente usar o hostname IPv4 do servidor de correio, confirme a porta (587 ou 465) e as regras de rede."
    );
  }

  if (msg.includes("ECONNREFUSED") || lower.includes("connection refused")) {
    return (
      "Ligação recusada pelo servidor SMTP. Verifique se o host e a porta estão corretos e se o serviço " +
      "aceita ligações a partir do servidor onde a aplicação corre."
    );
  }

  if (
    msg.includes("ETIMEDOUT") ||
    lower.includes("timeout") ||
    lower.includes("greeting never received") ||
    lower.includes("connection timeout")
  ) {
    return (
      "Tempo de espera esgotado ao ligar ao SMTP. Na porta 465 usa-se TLS implícito (a aplicação aplica a configuração correta ao enviar). " +
      "Na porta 587 deixe «TLS (secure)» desligado (STARTTLS). Verifique firewall, VPN e se o host e a porta estão corretos."
    );
  }

  if (msg.includes("EAUTH") || lower.includes("authentication") || lower.includes("535")) {
    return "Falha de autenticação SMTP. Verifique utilizador, senha e se a conta permite SMTP.";
  }

  if (lower.includes("certificate") || lower.includes("ssl") || lower.includes("tls")) {
    return "Erro de certificado ou TLS com o servidor SMTP. Verifique a opção TLS (secure) e o host.";
  }

  // IPv6 literal in message (e.g. 2603:...)
  if (/[0-9a-f]{0,4}:[0-9a-f:]+:\d{2,5}/i.test(msg) || (msg.includes("::") && msg.includes(":"))) {
    return (
      "Falha de ligação ao SMTP (possível endereço IPv6). Se o ambiente não suporta IPv6, configure o SMTP " +
      "com um hostname que resolva para IPv4 ou peça ao administrador de rede para permitir a saída."
    );
  }

  return `Erro ao enviar e-mail: ${msg}`;
}
