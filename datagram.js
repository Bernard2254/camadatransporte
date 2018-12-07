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
    return ConvertBase(num).from(10).to(2);
};


function readBinFile(fileName) {
	var fs = require("fs");
	var text = fs.readFileSync(fileName);
	return text;
}

function readStrFile(fileName) {
	var fs = require("fs");
	var text = fs.readFileSync(fileName);
	return text.toString().replace("\n", "");
}

function removeFile(fileName){
	var fs = require("fs");
	fs.unlinkSync(fileName)
}

function chekSumGenerator(){
	// TODO
}

var Datagram = class {
	constructor(sequenceNumber, ackNumber, dataOffset,
		reserved, ackFlag, synFlag, finFlag, microsoftWindow, checkSum,
		urgentPointer, badOptions, padding) {

		var applicationZap = readStrFile("application_ips.zap");
		// removeFile("application_ips.zap");

		var sourceInfo = applicationZap.split("-")[0];
		var destinationInfo = applicationZap.split("-")[1];

		this.sourcePort = sourceInfo.substring(sourceInfo.indexOf(":")+1, sourceInfo.length) 						// 16 bits
		this.destinationPort = destinationInfo.substring(destinationInfo.indexOf(":")+1, destinationInfo.length)	// 16 bits
		this.sequenceNumber = sequenceNumber;																		// 32 bits
		this.ackNumber = ackNumber;																					// 32 bits
		this.dataOffset = dataOffset;																				//  4 bits
		this.reserved = reserved;																					//  6 bits
		this.urgFlag = 0b0;																							//  1 bit
		this.ackFlag = ackFlag;																						//  1 bit
		this.pshFlag = 0b0;																							//  1 bit
		this.rstFlag = 0b0;																							//  1 bit
		this.synFlag = synFlag;																						//  1 bit
		this.finFLag = finFLag;																						//  1 bit
		this.microsoftWindow = microsoftWindow;																		// 16 bits
		this.urgentPointer = urgentPointer;																			// 16 bits
		this.badOptions = "";																						// variable bit
		this.dataDeAniversario = readBinFile("message_out.pdu");													// 16 bits
		// removeFile("message_out.pdu");
		this.checkSum = chekSumGenerator(this);																		// 16 bits
		this.padding = padding;																						// 16 bits
	}
};


// var test = "ip1:porta1-ip2:porta2" 192.888.132.5:30-192.888.132.6:40
// var destinationInfo = test.split("-")[0];
// console.log(destinationInfo.substring(destinationInfo.indexOf(":")+1, destinationInfo.length));

// var dataGram = new Datagram(1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
// console.log(dataGram);