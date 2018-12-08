var datagramLimitSize = 224
var optionLength = 0;

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
	allConcat+=sizeGarantee(dec2bin(datagram.badOptions), optionLength);
	allConcat+=sizeGarantee(dec2bin(datagram.padding), paddingLenght);
	allConcat+=datagram.dataDeAniversario;

	console.log(allConcat)

	return allConcat

}

function writeDatagramBin(fileName, datagram){
	var concat = concatDatagram(datagram);
	writeBinFile(fileName, concat);
}

function string2bin(string, size){
	var sum=0;
	for(i=size-1; i>=0; i--){
		if(string.charAt(i)==1){
			sum+=Math.pow(2, size-2-i);
		}
	}
	return sum;
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
	allConcat+=sizeGarantee(dec2bin(datagram.badOptions), optionLength);
	allConcat+=sizeGarantee(dec2bin(datagram.padding), paddingLenght);
	allConcat+=datagram.dataDeAniversario;

	var value=0;

	for(y=0; y<allConcat.length/16-1;y++){
		var tmp = allConcat.substring(y*16, ((y+1)*16)-1);
		value += string2bin(tmp, 16);
	}

	console.log(dec2bin(32));
	console.log(dec2bin(Math.abs(~32)));

}

function paddingLenght(datagram){
	return (datagramLimitSize-(160+optionLength)-dec2bin(datagram.dataDeAniversario).length)%32;
}

function generateDataOffset(datagram){
	return (192+optionLength+paddingLenght(datagram)+dec2bin(datagram.dataDeAniversario).length)/32;
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
		this.badOptions = "";																						// variable bit
		this.dataDeAniversario = dataDeAniversario;																	// 16 bits
		this.padding = "";																							// variable bit
		this.dataOffset = generateDataOffset(this);																	//  4 bits Número de 32 bits antes do conteúdo de data
		this.checkSum = generateCheksum(this);																		// 16 bits
		writeDatagramBin("datagram_out.pdu", this);
	}

};

var arrayOfAlreadyStart3WayHandShake = []

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

			if(arrayOfAlreadyStart3WayHandShake.length!=0 && lodash.filter(arrayOfAlreadyStart3WayHandShake, { 'source': sourcePort, 'destination': destinationPort } ) != undefined){
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
					0, // não indica que acabou data
					0, // urgent pointer não usado
					"" // sem data
				);
			}



		}
	}
}

new Datagram(30, 
			40, 
			0, // primeiro sequence number. Geralmente é randômico, para facilitar será 0
			0, // ackNumber não será utilizado nesse caso
			0, // reserved sempre nulo
			0, // urgent pointer não usado
			0, // não é um ACK
			0, // não indica o final de uma segmentação da data
			0, // não reseta conexão
			1, // tenta sincronizar
			0, // não indica que acabou data
			0, // urgent pointer não usado
			"" // sem data
		);

console.log(readBinFile('datagram_out.pdu'))

writeBinFile("teste.bin", "Bernard");


// var test = "ip1:porta1-ip2:porta2" 192.888.132.5:30-192.888.132.6:40
// var destinationInfo = test.split("-")[0];
// console.log(destinationInfo.substring(destinationInfo.indexOf(":")+1, destinationInfo.length));

// var dataGram = new Datagram(1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
// console.log(dataGram);