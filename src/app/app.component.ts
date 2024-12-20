import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import Web3 from 'web3';
import { ShortenAddressPipe } from './shorten-address.pipe';
import { HoverEffectDirective } from './hover-effect.directive';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ShortenAddressPipe,
    HoverEffectDirective,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Wallet';
  private web3: Web3;
  public walletAddress: string | null = null;
  public metaMaskInstalled: boolean = false;
  public nfts: any[] = [];
  public tokens: any[] = [];
  public showNftsClicked: boolean = false;
  public showTokensClicked: boolean = false;

  constructor() {
    this.web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    this.metaMaskInstalled = typeof window.ethereum !== 'undefined';
  }

  async connectWallet() {
    if (this.metaMaskInstalled) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.walletAddress = accounts[0];
        console.log('Connected wallet address:', this.walletAddress);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed!');
      alert(
        'MetaMask is not installed! Please install MetaMask and try again.'
      );
    }
  }

  disconnectWallet() {
    this.walletAddress = null;
    this.nfts = [];
    this.tokens = [];
    this.showNftsClicked = false;
    this.showTokensClicked = false;
    console.log('Disconnected from wallet');
  }

  async showNFTs() {
    this.showNftsClicked = true;
    if (this.walletAddress) {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': 'c96940f167f94a7bb56da10725c70541',
          },
        };
        const response = await fetch(
          `https://api.opensea.io/api/v2/chain/ethereum/account/${this.walletAddress}/nfts`,
          options
        );
        const data = await response.json();
        console.log('OpenSea API response:', data);
        if (data && data.nfts) {
          this.nfts = data.nfts;
          console.log('NFTs:', this.nfts);
        } else {
          this.nfts = [];
          console.error(
            'No NFTs found in the response or invalid response format'
          );
        }
      } catch (error) {
        this.nfts = [];
        console.error('Error fetching NFTs:', error);
      }
    } else {
      console.error('Wallet is not connected!');
    }
  }

  hideNFTs() {
    this.showNftsClicked = false;
  }

  async showTokens() {
    this.showTokensClicked = true;
    if (this.walletAddress) {
      try {
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=tokentx&address=${this.walletAddress}&startblock=0&endblock=999999999&sort=asc&apikey=3VKAGR1VCPFPY33MFYHPFNVSUPV1DUSWAQ`
        );
        const data = await response.json();
        if (data.status === '1' && Array.isArray(data.result)) {
          this.tokens = data.result;
        } else {
          this.tokens = [];
          console.error('Error fetching tokens:', data.message);
        }
        console.log('Tokens:', this.tokens);
      } catch (error) {
        this.tokens = [];
        console.error('Error fetching tokens:', error);
      }
    } else {
      console.error('Wallet is not connected!');
    }
  }

  hideTokens() {
    this.showTokensClicked = false;
  }
}
