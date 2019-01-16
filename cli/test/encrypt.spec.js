const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');

const encrypt = require('../actions/encrypt');

const logger =
{
    info: sinon.spy(),
    error: console.error,
    warn: console.warn,
    log: console.log
};

const kamusUrl = 'https://kamus.com';
const data = 'super-secret';
const serviceAccount = 'dummy';
const namespace = 'team-a';

let kamusApiScope;

describe('Encrypt', () => {
  beforeEach(() => {
    sinon.stub(process, 'exit');
    kamusApiScope = nock(kamusUrl)
      .post('/api/v1/encrypt', { data, ['service-account']: serviceAccount, namespace})
      .reply(200, '123ABC');
  });

  it('Should return encrypted data', async () => {
    await encrypt(null, {data, serviceAccount, namespace, kamusUrl}, logger);
    expect(kamusApiScope.isDone()).to.be.true;
    expect(process.exit.called).to.be.true;
    expect(process.exit.calledWith(0)).to.be.true;
    expect(logger.info.lastCall.lastArg).to.equal('Encrypted data:\n123ABC')
  });
});