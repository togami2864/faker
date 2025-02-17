import { afterEach, describe, expect, it } from 'vitest';
import { faker } from '../src';
import ibanLib from '../src/iban';
import { luhnCheck } from './support/luhnCheck';

const seedRuns = [
  {
    seed: 42,
    expectations: {
      account: '37917755',
      accountName: 'Money Market Account',
      amount: '374.54',
      bic: 'UYEOSCP1514',
      bitcoinAddress: '3XbJMAAara64sSkA9HD24YHQWd1b',
      creditCardCVV: '379',
      creditCardNumber: '3581-7755-1410-0486',
      currencyCode: 'IQD',
      currencyName: 'Iraqi Dinar',
      currencySymbol: '₱',
      ethereumAddress: '0x8be4abdd39321ad7d3fe01ffce404f4d6db0906b',
      iban: 'GT30Y75110867098F1E3542612J4',
      litecoinAddress: '3XbJMAAara64sSkA9HD24YHQWd1b',
      mask: '(...3791)',
      routingNumber: '379177554',
      transactionDescription:
        'deposit transaction at Wiegand, Deckow and Renner using card ending with ***(...6009) for SGD 374.54 in account ***00483617',
      transactionType: 'withdrawal',
    },
  },
  {
    seed: 1337,
    expectations: {
      account: '25122540',
      accountName: 'Money Market Account',
      amount: '262.02',
      bic: 'OEFELTL1032',
      bitcoinAddress: '3adhxs2jewAgkYgJi7No6Cn8JZa',
      creditCardCVV: '251',
      creditCardNumber: '6011-6212-2540-3255-2392',
      currencyCode: 'FJD',
      currencyName: 'Fiji Dollar',
      currencySymbol: '$',
      ethereumAddress: '0x5c346ba075bd57f5a62b82d72af39cbbb07a98cb',
      iban: 'FO7710540350900318',
      litecoinAddress: 'Madhxs2jewAgkYgJi7No6Cn8JZar',
      mask: '(...2512)',
      routingNumber: '251225401',
      transactionDescription:
        'deposit transaction at Cronin - Effertz using card ending with ***(...1830) for PEN 262.02 in account ***55239273',
      transactionType: 'withdrawal',
    },
  },
  {
    seed: 1211,
    expectations: {
      account: '94872190',
      accountName: 'Personal Loan Account',
      amount: '928.52',
      bic: 'LXUEBTZ1',
      bitcoinAddress: '1TMe8Z3EaFdLqmaGKP1LEEJQVriSZRZdsA',
      creditCardCVV: '948',
      creditCardNumber: '4872190616276',
      currencyCode: 'XDR',
      currencyName: 'SDR',
      currencySymbol: '₭',
      ethereumAddress: '0xeadb42f0e3f4a973fab0aeefce96dfcf49cd438d',
      iban: 'TN0382001124170679299069',
      litecoinAddress: 'MTMe8Z3EaFdLqmaGKP1LEEJQVriSZRZds',
      mask: '(...9487)',
      routingNumber: '948721904',
      transactionDescription:
        'deposit transaction at Trantow - Sanford using card ending with ***(...8076) for PYG 928.52 in account ***62743167',
      transactionType: 'invoice',
    },
  },
];

const functionNames = [
  'account',
  'accountName',
  'amount',
  'bic',
  'bitcoinAddress',
  'creditCardCVV',
  'creditCardNumber',
  'currencyCode',
  'currencyName',
  'currencySymbol',
  'ethereumAddress',
  'iban',
  'litecoinAddress',
  'mask',
  'routingNumber',
  'transactionDescription',
  'transactionType',
];

const NON_SEEDED_BASED_RUN = 5;

describe('finance', () => {
  afterEach(() => {
    faker.locale = 'en';
  });

  for (const { seed, expectations } of seedRuns) {
    describe(`seed: ${seed}`, () => {
      for (const functionName of functionNames) {
        it(`${functionName}()`, () => {
          faker.seed(seed);
          const actual = faker.finance[functionName]();
          expect(actual).toEqual(expectations[functionName]);
        });
      }
    });
  }

  // Create and log-back the seed for debug purposes
  faker.seed(Math.ceil(Math.random() * 1_000_000_000));

  describe(`random seeded tests for seed ${faker.seedValue}`, () => {
    for (let i = 1; i <= NON_SEEDED_BASED_RUN; i++) {
      describe('account(length)', () => {
        it('should supply a default length', () => {
          const accountNum = faker.finance.account();
          expect(accountNum).toBeTruthy();
          expect(
            accountNum,
            'The length of the account number should be 8 characters long'
          ).toHaveLength(8);
        });

        it('should supply a default length if a zero is passed', () => {
          const accountNum = faker.finance.account(0);
          expect(accountNum).toBeTruthy();
          expect(
            accountNum,
            'The length of the account number should be 8 characters long'
          ).toHaveLength(8);
        });

        it('should be the the length fo given number', () => {
          const accountNum = faker.finance.account(16);
          expect(accountNum).toBeTruthy();
          expect(
            accountNum,
            'The length of the  account number should match the given number'
          ).toHaveLength(16);
        });
      });
    }
  });

  describe('accountName()', () => {
    const accountName = faker.finance.accountName();
    expect(accountName).toBeTruthy();
    expect(typeof accountName).toBe('string');
  });

  describe('amount(min, max, dec, symbol)', () => {
    it('should use the default amounts when not passing arguments', () => {
      const amount = faker.finance.amount();

      expect(amount).toBeTruthy();
      expect(+amount, 'the amount should be greater than 0').greaterThan(0);
      expect(+amount, 'the amount should be less than 1001').lessThan(1001);
    });

    it('should use the default decimal location when not passing arguments', () => {
      let amount = faker.finance.amount();

      amount = faker.finance.amount(100, 100, 1);

      expect(amount).toBeTruthy();
      expect(amount, 'the amount should be equal 100.0').toStrictEqual('100.0');
    });

    //TODO: add support for more currency and decimal options
    it('should not include a currency symbol by default', () => {
      const amount = faker.finance.amount();

      expect(
        amount,
        'The expected match should not include a currency symbol'
      ).match(/[0-9.]/);
    });

    it('it should handle negative amounts', () => {
      const amount = faker.finance.amount(-200, -1);

      expect(amount).toBeTruthy();
      expect(+amount, 'the amount should be less than 0').lessThan(0);
      expect(+amount, 'the amount should be greater than -201').greaterThan(
        -201
      );
    });

    it('it should handle argument dec', () => {
      const amount = faker.finance.amount(100, 100, 1);

      expect(amount).toBeTruthy();
      expect(amount, 'the amount should be equal 100.0').toStrictEqual('100.0');
    });

    it('it should handle argument dec = 0', () => {
      const amount = faker.finance.amount(100, 100, 0);

      expect(amount).toBeTruthy();
      expect(amount, 'the amount should be equal 100').toStrictEqual('100');
    });

    it('it should return a string', () => {
      const amount = faker.finance.amount(100, 100, 0);

      expect(amount).toBeTruthy();
      expect(typeof amount, 'the amount type should be string').toBe('string');
    });

    [false, undefined].forEach((autoFormat) => {
      it(`should return unformatted if autoformat is ${autoFormat}`, () => {
        const number = 6000;
        const amount = faker.finance.amount(
          number,
          number,
          0,
          undefined,
          autoFormat
        );

        expect(amount).toStrictEqual(number.toString());
      });
    });

    it('should return the number formatted on the current locale', () => {
      const number = 6000;
      const decimalPlaces = 2;
      const expected = number.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
      });

      const amount = faker.finance.amount(
        number,
        number,
        decimalPlaces,
        undefined,
        true
      );

      expect(amount).toStrictEqual(expected);
    });
  });

  describe('bic()', () => {
    it('returns a random yet formally correct BIC number', () => {
      const bic = faker.finance.bic();
      const expr = new RegExp(
        `^[A-Z]{4}(${ibanLib.iso3166.join(
          '|'
        )})[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?\$`,
        'i'
      );
      expect(typeof bic).toBe('string');
      expect(bic).match(expr);
    });
  });

  describe('bitcoinAddress', () => {
    const bitcoinAddress = faker.finance.bitcoinAddress();
    /**
     *  Note: Although the total length of a Bitcoin address can be 25-33 characters, regex quantifiers only check the preceding token
     *  Therefore we take one from the total length of the address not including the first character ([13])
     */

    expect(bitcoinAddress).toBeTruthy();
    expect(typeof bitcoinAddress).toBe('string');
    expect(bitcoinAddress).match(/^[13][a-km-zA-HJ-NP-Z1-9]{24,33}$/);
  });

  describe('creditCardCVV', () => {
    const cvv = faker.finance.creditCardCVV();
    expect(typeof cvv).toBe('string');
    expect(cvv).match(/\d{3}/);
    expect(
      cvv,
      'The length of the cvv should be 3 characters long'
    ).toHaveLength(3);
  });

  describe('creditCardNumber', () => {
    it('returns a random credit card number', () => {
      let number = faker.finance.creditCardNumber();
      number = number.replace(/\D/g, ''); // remove formatting
      console.log('version:', process.version, number, number.length);
      expect(number.length).greaterThanOrEqual(13);
      expect(number.length).lessThanOrEqual(20);
      expect(number).match(/^\d{13,20}$/);
      expect(luhnCheck(number)).toBeTruthy();
    });

    it('returns a valid credit card number', () => {
      expect(luhnCheck(faker.finance.creditCardNumber(''))).toBeTruthy();
      expect(luhnCheck(faker.finance.creditCardNumber())).toBeTruthy();
      expect(luhnCheck(faker.finance.creditCardNumber())).toBeTruthy();
      expect(luhnCheck(faker.finance.creditCardNumber('visa'))).toBeTruthy();
      expect(
        luhnCheck(faker.finance.creditCardNumber('mastercard'))
      ).toBeTruthy();
      expect(
        luhnCheck(faker.finance.creditCardNumber('discover'))
      ).toBeTruthy();
      expect(luhnCheck(faker.finance.creditCardNumber())).toBeTruthy();
      expect(luhnCheck(faker.finance.creditCardNumber())).toBeTruthy();
    });

    it('returns a correct credit card number when issuer provided', () => {
      //TODO: implement checks for each format with regexp
      const visa = faker.finance.creditCardNumber('visa');
      expect(visa).match(/^4(([0-9]){12}|([0-9]){3}(\-([0-9]){4}){3})$/);
      expect(luhnCheck(visa)).toBeTruthy();

      const mastercard = faker.finance.creditCardNumber('mastercard');
      expect(mastercard).match(/^(5[1-5]\d{2}|6771)(\-\d{4}){3}$/);
      expect(luhnCheck(mastercard)).toBeTruthy();

      const discover = faker.finance.creditCardNumber('discover');

      expect(luhnCheck(discover)).toBeTruthy();

      const american_express =
        faker.finance.creditCardNumber('american_express');
      expect(luhnCheck(american_express)).toBeTruthy();
      const diners_club = faker.finance.creditCardNumber('diners_club');
      expect(luhnCheck(diners_club)).toBeTruthy();
      const jcb = faker.finance.creditCardNumber('jcb');
      expect(luhnCheck(jcb)).toBeTruthy();
      const switchC = faker.finance.creditCardNumber('mastercard');
      expect(luhnCheck(switchC)).toBeTruthy();
      const solo = faker.finance.creditCardNumber('solo');
      expect(luhnCheck(solo)).toBeTruthy();
      const maestro = faker.finance.creditCardNumber('maestro');
      expect(luhnCheck(maestro)).toBeTruthy();
      const laser = faker.finance.creditCardNumber('laser');
      expect(luhnCheck(laser)).toBeTruthy();
      const instapayment = faker.finance.creditCardNumber('instapayment');
      expect(luhnCheck(instapayment)).toBeTruthy();
    });

    it('returns custom formated strings', () => {
      let number = faker.finance.creditCardNumber('###-###-##L');
      expect(number).match(/^\d{3}\-\d{3}\-\d{3}$/);
      expect(luhnCheck(number)).toBeTruthy();

      number = faker.finance.creditCardNumber('234[5-9]#{999}L');
      expect(number).match(/^234[5-9]\d{1000}$/);
      expect(luhnCheck(number)).toBeTruthy();
    });
  });

  describe('currencyCode()', () => {
    const currencyCode = faker.finance.currencyCode();
    expect(typeof currencyCode).toBe('string');
    expect(currencyCode).match(/^[A-Z]{3}$/);
  });

  describe('currencyName()', () => {
    const currencyName = faker.finance.currencyName();
    expect(typeof currencyName).toBe('string');
  });

  describe('currencySymbol()', () => {
    const currencySymbol = faker.finance.currencySymbol();
    expect(typeof currencySymbol).toBe('string');
  });

  describe('ethereumAddress()', () => {
    const ethereumAddress = faker.finance.ethereumAddress();
    expect(typeof ethereumAddress).toBe('string');
    expect(ethereumAddress).match(/^(0x)[0-9a-f]{40}$/);
  });

  describe('iban()', () => {
    it('returns a random yet formally correct IBAN number', () => {
      const iban: string = faker.finance.iban();
      const bban = iban.substring(4) + iban.substring(0, 4);
      expect(
        ibanLib.mod97(ibanLib.toDigitString(bban)),
        'the result should be equal to 1'
      ).toStrictEqual(1);
    });

    it('returns a specific and formally correct IBAN number', () => {
      const iban: string = faker.finance.iban(false, 'DE');
      const bban = iban.substring(4) + iban.substring(0, 4);
      const countryCode = iban.substring(0, 2);
      expect(countryCode).toBe('DE');
      expect(
        ibanLib.mod97(ibanLib.toDigitString(bban)),
        'the result should be equal to 1'
      ).toStrictEqual(1);
    });

    it('throws an error if the passed country code is not supported', () => {
      expect(() => faker.finance.iban(false, 'AA')).toThrowError(
        Error('Country code AA not supported.')
      );
    });
  });

  describe('litecoinAddress()', () => {
    const litecoinAddress = faker.finance.litecoinAddress();
    expect(typeof litecoinAddress).toBe('string');
    expect(litecoinAddress).match(/^[LM3][1-9a-km-zA-HJ-NP-Z]{25,32}$/);
  });

  describe('mask(length, parens, ellipsis)', () => {
    it('should set a default length', () => {
      const expected = 4; //default account mask length
      const mask = faker.finance.mask(null, false, false);

      expect(
        mask,
        `The expected default mask length is ${expected} but it was ${mask.length}`
      ).toHaveLength(expected);
    });

    it('should set a specified length', () => {
      let expected = faker.datatype.number(20);

      expected =
        expected === 0 || !expected || typeof expected == 'undefined'
          ? 4
          : expected;

      const mask = faker.finance.mask(expected, false, false); //the length of mask picks 4 if the random number generator picks 0

      expect(
        mask,
        `The expected default mask length is ${expected} but it was ${mask.length}`
      ).toHaveLength(expected);
    });
  });

  describe('routingNumber()', () => {
    const routingNumber = faker.finance.routingNumber();
    expect(typeof routingNumber).toBe('string');
  });

  describe('transactionDescription()', () => {
    const transactionDescription = faker.finance.transactionDescription();
    expect(typeof transactionDescription).toBe('string');
  });

  describe('transactionType()', () => {
    const transactionType = faker.finance.transactionType();
    expect(typeof transactionType).toBe('string');
  });
});
