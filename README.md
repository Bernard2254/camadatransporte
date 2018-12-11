# Camada de Transporte 

>- **Camada Fisica:** https://github.com/pedrohenriquecordeiro/camadafisica
>- **Camada Rede:** https://github.com/thiagofigcosta/camadarede
>- **Camada Transporte:** https://github.com/Bernard2254/camadatransporte
>- **Camada Aplicação:** https://github.com/thiagofigcosta/camadaaplicacao

>- **Todas as camadas:** https://github.com/thiagofigcosta/tcpip_layers

Implementacao da Camada de Transporte  do Trabalho Prático de Redes 1 - CEFET-MG

  - Integrantes do grupo:
    + Bernard Menezes Moreira da Costa bernard.menezes98@gmail.com
    + Pedro Henrique Cordeiro de Jesus pedro.henrique.cefetmg@gmail.com
    + Thiago Figueiredo Costa thiagofigcosta@hotmail.com
    + Marcos Tiago Ferreira Henriques marcostiagofh@gmail.com

O Enunciado está neste __[link.](https://docs.google.com/document/d/1O3cNM0T6gFNz9PeMYcnzbmBzEe8J7k34DaefJDSsv4A/edit)__

___

---

***

## Relação de Linguagens Escolhidas 

| Camada        | Linguagem   |
| ------------- | ----------- |
| aplicação     | python      |
| transporte    | javascript  |
| rede          | swift       |
| fisica        | perl        |
___


## Uso do Código

### Camada de Transporte
Instale a linguagem `javascript`:

    sudo apt-get install nodejs 
    sudo apt-get install npm


Para executar basta rodar os comandos:
```
	nodejs transport_layer.js
```


# Documentaçãp

---

![Imagem indisponível][generic_diagram]
>- **Legenda**: Essa camada é a 2ª camada do TCP/IP, entre Aplicação 1ª camada e Redes 3ª camada;

---

## Informações
>- **PDU**: Datagrama ou Segmento;
>- [**RFC 793**](https://tools.ietf.org/html/rfc793);

---

## Introdução
>- Camada responsável por definir a maneira de conexão a ser feita:
>>- Orientada à conexão (TCP): 
>>>- Protocolo de controle de transmissão;
>>>- Fornece confiabilidade no processo de comunicação entre pares de computadores conectados a redes distintas, mas interconectadas;
>>- Não orientada à conexão (UDP):
>>>- Realiza um *bypass*, sem garantir que a conexão entre os computadores foi estabelecida;

![Imagem indiponível][introduction_tcp_udp]
>- **Legenda**: Comportamento distinto entre os tipos de conexão;

---

## TCP (Transport Control Protocol)
>- Explora as seguintes áreas:
>>- Transferência de dados básicos:
>>>- Fluxo de octetos (64 bits) entre os computadores
>>- Confiabilidade:
>>>- Responsável por recuperar conteúdo modificado, perdido, duplicado e entregue em fora de ordem;
>>>>- *Checksum*: usado para garantir que não houve modificação;
>>>>- *Sequence number* para cada octeto (64 bits) é usado no receptor para verificar a ordem de entrega do segmento, realizar o controle de duplicação e um *timeout* para a recepção da confirmação do receptor (caso passe do timeout emissor reenvia);  
>>- Controle de fluxo:
>>>- O remetende pode congestionar a rede mandando vários segmentos. Para isso o receptor retorna junto com o *ACK* (confirmação) uma janela que contém um intervalo de números de sequências aceitáveis, dando permissão ao remetente de enviar mais segmentos; 
>>- Multiplexação:
>>>- Utilização de portas para separar serviços, as quais formam junto com o endereçamento do host (definido na camada de rede) o *Socket*;
>>- Conexões:
>>>- Informações de status dos dados transferidos ( incluindo *socket*, *sequence numbers* e tamanho da janela);
>>>- É necessário estabilizar a conexão, antes da troca de dados, essa estabilização é chamada de *handshake*;
>>>- Quando a comunicação é finalizada, a conexão é fechada e fica livre para uso por outro processo de comunicação;
>>>- É identificado unicamente pelo par de *sockets*;
>>- Precedência e Segurança:
>>>- É possível definir a prioridade e configurações de segurança;

---

### Funcionalidades providas pelo TCP
>- **Conexão**:
>>- Cliente antes de mandar informação deve estabelecer uma conexão;
>>- São utilizados flags:
>>>- *SYN*: flag que indica solicitação de estabelecimento de conexão com o outro host;
>>>- *FIN*: flag que indica solicitação de finalização de conexão com outro host;
>>>- *ACK*: flag de confirmação de solicitações;
>- **Confiabilidade**:
>>- Checa se as informações transmitidas estão corretas;
>>- *Checksum*:
>- **Entrega ordenada**:
>>- Administra a ordem a qual os datagramas chegam no destino através do *Sequence Number*;
>- **Controle de fluxo**:
>>- Origem aguarda confirmação do recebimento do pacote, caso não receba envia novamente;


[generic_diagram]: https://image.slidesharecdn.com/ethernetvietnguyen-150404074840-conversion-gate01/95/ethernet-networking-presentation-14-638.jpg?cb=1428151802 "Diagrama Genérico - Camada de Transporte é a camada representada pelo TCP/UDP"
[introduction_tcp_udp]: http://1.bp.blogspot.com/-t30dpfdTKcw/T60838mE-zI/AAAAAAAAAAM/VZSxwm0F3gc/s1600/tcp-versus-udp.jpg "Ilustração do comportamento dos tipos de conexão"
