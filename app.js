const App = {
    web3: null,
    account: null,

	connectMetamask: async function() {
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				await ethereum.enable();
				var accounts= await web3.eth.getAccounts();
			} catch (error) {
				// User denied account access...
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(web3.currentProvider);
			// Acccounts always exposed
		}
		// Non-dapp browsers...
		else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
		
		document.getElementById("walletprovider").innerHTML = "Estás usando METAMASK";
		App.start(window.web3);
	},

	connectFortmatic: async function() {
		const customNodeOptions = {
			rpcUrl: 'https://connect.pichain.io', // your own node url
			chainId: 31416 // chainId of your own node
		}

		// Setting network to localhost blockchain
		const fm = new Fortmatic('pk_test_0CAE1CD64F66E898', customNodeOptions);
		//const fm = new Fortmatic('pk_test_0CAE1CD64F66E898');
		let _web3 = new Web3(fm.getProvider());

		// TODO: Step 2: Setup Developer API Key
		//let fm = new Fortmatic('pk_test_0CAE1CD64F66E898');
		//let _web3 = new Web3(fm.getProvider());
		// End Step 2
		document.getElementById("walletprovider").innerHTML = "Estás usando FORTMATIC";
		App.start(_web3);
	},

	connectPortis: async function() {

		const myPrivateEthereumNode = {
			nodeUrl: 'https://connect.pichain.io',
			chainId: 31416,
		};
		const portis = new Portis('b2ecb8e5-0ec3-4874-86c9-e71859d74cb6', myPrivateEthereumNode);
		const _web3 = new Web3(portis.provider);
		
		await portis.showPortis();

		let _isLogged = await portis.isLoggedIn();

		portis.onLogout(() => {
			console.log('User logged out');
		});		  

		if (_isLogged.result) {
			document.getElementById("walletprovider").innerHTML = "Estás usando PORTIS";
			App.start(_web3);
		}
	},

    start: async function(web3) {
        this.web3 = web3;

        try {
            const accounts = await this.web3.eth.getAccounts();
			this.account = accounts[0];
			//console.log(this.web3.version);
			//console.log(await this.web3.eth.net.getId())
			//console.log(this.account);

			this.updateInfo();

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
	},

	updateInfo: async function() {
		let _user = this.account;
		_user = this.checkAccount(String(_user));

		let _networkId = await this.web3.eth.net.getId();
		let _network;
		if (_networkId == 31416) {
			_network = "PI Blockchain";
		} else {
			_network = "ETH Testnet";
		}

		let _balancePi = await this.web3.eth.getBalance(String(_user));
		document.getElementById("info").innerHTML = _network + " <br> " +  this.account + " <br> " + this.convertBNtoPrintable(_balancePi) + " PI";
	},

	sign: async function() {
		let _message = "Some string"
		let _hash = this.web3.utils.sha3(_message)
		let _signature = await this.web3.eth.personal.sign(_hash, this.account);

		//let _signing_address = await this.web3.eth.personal.ecRecover(_hash, _signature)
		
		document.getElementById("signature").innerHTML = _signature;

		console.log(_signature)
		console.log(this.account)
	},

	checkAccount: function(_account) {
		//Eliminar caracteres de control
        _account = _account.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        //Eliminar espacios en blanco
        _account = _account.replace(/\s/g, "");
        //Corregir checksum (problemas con mayúsculas minúsculas etc)
        return this.web3.utils.toChecksumAddress(_account);
	},

	convertBNtoPrintable: function(_BN) {
		let _number = new BigNumber(_BN);
		return _number.dividedBy(1e18).toFixed(2);
	}
}    

window.App = App;

window.addEventListener('load', async () => {
    /*// Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            var accounts= await web3.eth.getAccounts();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    console.log(web3.version);
    App.start(window.web3);*/
});