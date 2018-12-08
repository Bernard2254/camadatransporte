var maximumSegmentSize=536;

var ConvertBase = function (num) {
    return {
        from : function (baseFrom) {
            return {
                to : function (baseTo) {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

var bin2dec = function (num) {
    return ConvertBase(num).from(2).to(10);
};

var dec2bin = function (num) {
	if (num==="")
		return "";
    return ConvertBase(num).from(10).to(2);
};


function readBinFile(fileName) {
	var fs = require("fs");
	var text = fs.readFileSync(fileName, 'base64');
	return text;
}

function readStrFile(fileName) {
	var fs = require("fs");
	var text = fs.readFileSync(fileName);
	return text.toString().replace("\n", "");
}

function writeBinFile(fileName, string){
	var fs = require('fs');
	while (fs.existsSync(fileName)) {
		
	}
	var buf = new Buffer(string, 'base64');
	fs.writeFile(fileName, buf);
	// var wstream = fs.createWriteStream(fileName, 'base64');
	// wstream.write(string);
}

function removeFile(fileName){
	var fs = require("fs");
	fs.unlinkSync(fileName)
}

function sizeGarantee(binary, size){
	var bin = ""+binary;
	for(i=0; i<size;i++){
		if(bin.length==size)
			break;
		bin="0"+bin;
	}
	return bin;
}

function concatDatagram(datagram){

	var allConcat = sizeGarantee(dec2bin(datagram.sourcePort), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.destinationPort), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.sequenceNumber), 32);
	allConcat+=sizeGarantee(dec2bin(datagram.ackNumber), 32);
	allConcat+=sizeGarantee(dec2bin(datagram.dataOffset), 4);
	allConcat+=sizeGarantee(dec2bin(datagram.reserved), 6);
	allConcat+=sizeGarantee(dec2bin(datagram.urgFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.ackFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.pshFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.rstFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.synFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.finFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.microsoftWindow), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.checkSum), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.urgentPointer), 16);
	allConcat+=dec2bin(datagram.badOptions);
	allConcat+=sizeGarantee(dec2bin(datagram.padding), paddingLenght);
	allConcat+=datagram.dataDeAniversario;

	console.log(allConcat)

	return allConcat

}

function writeDatagramBin(fileName, datagram){
	var concat = concatDatagram(datagram);
	writeBinFile(fileName, concat);
}

function stringBin2dec(string){
	var sum=0;
	for(i=string.length-1; i>=0; i--){
		if(string.charAt(i)==1){
			sum+=Math.pow(2, string.length-1-i);
		}
	}
	return sum;
}

function notOperator(string){
	var not = "";
	for(i=0; i<string.length; i++){
		if(string.charAt(i)==1){
			not=not+0;
		} else {
			not=not+1;
		}
	}
	return not;

}

function objectPropInArray(list, prop, val, prop2, val2) {
  if (list.length > 0 ) {
    for (i in list) {
      if (list[i][prop] === val && list[i][prop2] === val2) {
        return list[i];
      }
    }
  }
  return undefined;
}

function setPropInArray(list, prop, val, prop2, val2, setProp, valSetProp) {
  if (list.length > 0 ) {
    for (i in list) {
      if (list[i][prop] === val && list[i][prop2] === val2) {
      	list[i][setProp] = valSetProp;
      }
    }
  }
}

function generateCheksum(datagram){
	var allConcat = sizeGarantee(dec2bin(datagram.sourcePort), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.destinationPort), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.sequenceNumber), 32);
	allConcat+=sizeGarantee(dec2bin(datagram.ackNumber), 32);
	allConcat+=sizeGarantee(dec2bin(datagram.dataOffset), 4);
	allConcat+=sizeGarantee(dec2bin(datagram.reserved), 6);
	allConcat+=sizeGarantee(dec2bin(datagram.urgFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.ackFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.pshFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.rstFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.synFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.finFlag), 1);
	allConcat+=sizeGarantee(dec2bin(datagram.microsoftWindow), 16);
	allConcat+=sizeGarantee(dec2bin(datagram.urgentPointer), 16);
	allConcat+=dec2bin(datagram.badOptions);
	allConcat+=sizeGarantee(dec2bin(datagram.padding), paddingLenght);
	allConcat+=datagram.dataDeAniversario;

	var value=0;

	for(y=0; y<allConcat.length/16-1;y++){
		var tmp = allConcat.substring(y*16, ((y+1)*16));
		value += stringBin2dec(tmp);
	}

	value = sizeGarantee(dec2bin(value%Math.pow(2, 16)), 16);
	value = stringBin2dec(value.substring(4))+stringBin2dec(value.substring(0, 4));
	value = sizeGarantee(dec2bin(value%Math.pow(2, 16)), 16)
	return stringBin2dec(notOperator(value));

}

function paddingLenght(datagram){
	return (datagram.badOptions-(160+dec2bin(datagram.badOptions).length)-dec2bin(datagram.dataDeAniversario).length)%32;
}

function generateDataOffset(datagram){
	return (192+dec2bin(datagram.badOptions).length+paddingLenght(datagram)+dec2bin(datagram.dataDeAniversario).length)/32;
}

var Datagram = class {
	constructor(sourcePort, destinationPort, sequenceNumber, ackNumber,
		reserved, urgFlag, ackFlag, pshFlag, rstFlag, synFlag, finFlag,
		urgentPointer, dataDeAniversario) {

		this.sourcePort = sourcePort														 						// 16 bits
		this.destinationPort = destinationPort																		// 16 bits
		this.sequenceNumber = sequenceNumber;																		// 32 bits
		this.ackNumber = ackNumber;																					// 32 bits
		this.reserved = reserved;																					//  6 bits
		this.urgFlag = urgFlag;																						//  1 bit
		this.ackFlag = ackFlag;																						//  1 bit
		this.pshFlag = pshFlag;																						//  1 bit
		this.rstFlag = rstFlag;																						//  1 bit
		this.synFlag = synFlag;																						//  1 bit
		this.finFlag = finFlag;																						//  1 bit
		this.microsoftWindow = 0b100;																				// 16 bits tamnho da janela fixo 4
		this.urgentPointer = urgentPointer;																			// 16 bits
		this.badOptions = maximumSegmentSize;																		// 10 bits maximum segment size (MSS) 
		this.dataDeAniversario = dataDeAniversario;																	// 16 bits
		this.padding = "";																							// variable bit
		this.dataOffset = generateDataOffset(this);																	//  4 bits Número de 32 bits antes do conteúdo de data
		this.checkSum = generateCheksum(this);																		// 16 bits
		writeDatagramBin("datagram_out.pdu", this);
	}

};

function getNextAck(){
	
}

var arrayOfConections = [];

function forward(){
	var fs = require('fs');
	while(true){
		if (fs.existsSync("message_out.pdu") && fs.existsSync("application_ips.zap") && !fs.existsSync("datagram_out.pdu")) {
		    var applicationZap = readStrFile("application_ips.zap");
		    // removeFile("application_ips.zap");
		    var dataDeAniversario = readBinFile("message_out.pdu");
		    // removeFile("message_out.pdu");
			var sourceInfo = applicationZap.split("-")[0];
			var destinationInfo = applicationZap.split("-")[1];
			var sourcePort = sourceInfo.substring(sourceInfo.indexOf(":")+1, sourceInfo.length) 						
			var destinationPort = destinationInfo.substring(destinationInfo.indexOf(":")+1, destinationInfo.length)

			var startConection = true;

			if(arrayOfConections.length!=0 && objectPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort)!=undefined){
				startConection=false;
			}

			if(startConection){
				new Datagram(sourcePort, 
					destinationPort, 
					0, // primeiro sequence number. Geralmente é randômico, para facilitar será 0
					0, // ackNumber não será utilizado nesse caso
					0, // reserved sempre nulo
					0, // urgent pointer não usado
					0, // não é um ACK
					0, // não indica o final de uma segmentação da data
					0, // não reseta conexão
					1, // tenta sincronizar
					0, // não indica que acabou a conexão
					0, // urgent pointer não usado
					"" // sem data
				);
				arrayOfConections.push({'source': sourcePort, 'destination': destinationPort, 'expectedAck': 0, 'windowAck': [1, 2, 3], 'handshakeSituation': "IN_PROGRESS", 'conectionMMS': 536, 'data':[dataDeAniversario]});

			} else {

				var buffer = objectPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort);

				switch (buffer.handshakeSituation){
					case "IN_PROGRESS":

						setPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort, 'data', buffer.data.push(dataDeAniversario));

						break;
					case "IN_PROGRESS_TO_FINISH":
						
						break;
					case "DONE":

						var sendData = dataDeAniversario;
						
						if(buffer.data.length>0){
							sendData = buffer.data[0]
							setPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort, 'data', buffer.data.push(dataDeAniversario));							
						}

						if(buffer.windowAck[0] >= buffer.expectedAck+4){
							console.log("Esperando confirmação ack: "+buffer.expectedAck);
							if(sendData==dataDeAniversario){
								setPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort, 'data', buffer.data.push(dataDeAniversario));									
							}
						} else {

							var sequenceNumber = buffer.windowAck[0];
							setPropInArray(arrayOfConections,'source', sourcePort, 'destination', destinationPort, 'windowAck', buffer.windowAck.map((a, i) => a + [1,1,1][i]));	

							for(i=0; i<sendData.length/maximumSegmentSize; i++){
								if(i+1==sendData.length/maximumSegmentSize){
									new Datagram(sourcePort, 
										destinationPort, 
										sequenceNumber, // primeiro sequence number. Geralmente é randômico, para facilitar será 0
										0, // ackNumber não será utilizado nesse caso
										0, // reserved sempre nulo
										0, // urgent pointer não usado
										0, // não é um ACK
										1, // não indica o final de uma segmentação da data
										0, // não reseta conexão
										0, // tenta sincronizar
										0, // não indica que acabou conexão
										0, // urgent pointer não usado
										sendData.substring(i*maximumSegmentSize)
									);
								}
							}

							

						}

						break;

				}


			}



		}
	}
}


function receive(){

}

// new Datagram(30, 
// 			40, 
// 			0, // primeiro sequence number. Geralmente é randômico, para facilitar será 0
// 			0, // ackNumber não será utilizado nesse caso
// 			0, // reserved sempre nulo
// 			0, // urgent pointer não usado
// 			0, // não é um ACK
// 			0, // não indica o final de uma segmentação da data
// 			0, // não reseta conexão
// 			1, // tenta sincronizar
// 			0, // não indica que acabou data
// 			0, // urgent pointer não usado
// 			"" // sem data
// 		);


console.log(dec2bin(536));

// arrayOfConections.push({'source': 30, 'destination': 40, 'expectedAck': 1, 'receivedAck': []});

// setPropInArray(arrayOfConections,'source', 30, 'destination', 40, 'receivedAck', ['bernard'])

// console.log(arrayOfConections[0].receivedAck);



// console.log(arrayOfConections[0].receivedAck.push(2));
// console.log(objectPropInArray(arrayOfConections,'source', 30, 'destination', 40).receivedAck);

// console.log(readBinFile('datagram_out.pdu'))

// writeBinFile("teste.bin", "Bernard");


// var test = "ip1:porta1-ip2:porta2" 192.888.132.5:30-192.888.132.6:40
// var destinationInfo = test.split("-")[0];
// console.log(destinationInfo.substring(destinationInfo.indexOf(":")+1, destinationInfo.length));

// var dataGram = new Datagram(1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
// console.log(dataGram);