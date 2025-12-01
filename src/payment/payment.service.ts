import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private merchantId: string = 'c751ba36-87f8-42f8-9f78-3e3498f5c6f4';
  private requestUrl =
    'https://sandbox.zarinpal.com/pg/v4/payment/request.json';
  private verifyUrl = 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json';
  private startPay = 'https://sandbox.zarinpal.com/pg/StartPay/';

  constructor(private configService: ConfigService) {
    this.merchantId = this.configService.get<string>('MERCHANT_ID') || '';
  }

  /**
   * ایجاد تراکنش
   */
  async createPayment(
    amount: number,
    description: string,
    callbackUrl: string,
    metadata?: any,
  ) {
    try {
      const payload = {
        merchant_id: this.merchantId,
        amount: Math.round(+amount),
        callback_url: callbackUrl,
        description: description,
        metadata: metadata || [],
      };

      const { data } = await axios.post(this.requestUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (data?.data?.code !== 100) {
        throw new HttpException(data.errors, 400);
      }

      return {
        authority: data.data.authority,
        url: this.startPay + data.data.authority,
      };
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Payment request failed',
        500,
      );
    }
  }

  /**
   * تأیید تراکنش
   */
  async verifyPayment(amount: number, authority: string) {
    try {
      const payload = {
        merchant_id: this.merchantId,
        amount: Math.round(+amount),
        authority: authority,
      };

      const { data } = await axios.post(this.verifyUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (data?.data?.code === 100) {
        return {
          status: 'SUCCESS',
          refId: data.data.ref_id,
          cardHash: data.data.card_hash,
          cardPan: data.data.card_pan,
          fee: data.data.fee,
        };
      }

      if (data?.data?.code === 101) {
        return {
          status: 'SUBMITTED_BEFORE',
          message: 'Payment already verified',
        };
      }

      throw new HttpException(data.errors, 400);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Payment verification failed',
        500,
      );
    }
  }
}
