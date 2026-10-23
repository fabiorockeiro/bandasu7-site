# www.bandasu7.com.br
 Site do Ministério de Louvor SU7

## Prévia local

Na pasta do projeto, execute:

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

Abra http://localhost:5500 no navegador. Para encerrar o servidor, pressione
`Ctrl+C` no terminal.

Evite abrir `index.html` diretamente pelo endereço `file:///`: nesse modo,
o navegador não envia o cabeçalho HTTP `Referer` exigido pelos players do
YouTube, que podem exibir o erro 153. Os vídeos devem ser testados por HTTP
no servidor local ou por HTTPS no site publicado.
