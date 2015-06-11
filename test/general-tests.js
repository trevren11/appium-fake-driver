import chai from 'chai';
import { initSession, DEFAULT_CAPS } from './helpers';

const should = chai.should();

function generalTests () {
  describe('generic actions', () => {
    let driver;
    initSession(DEFAULT_CAPS).then((d) => { driver = d; });
    it('should not send keys without a focused element', async () => {
      await driver.keys("test").should.eventually.be.rejectedWith(/12/);
    });
    it('should send keys to a focused element', async () => {
      let el = await driver.elementById('input');
      await el.click();
      await driver.keys("test");
      (await el.text()).should.equal("test");
    });
    it.skip('should set geolocation', async () => {
      // TODO unquarantine when WD fixes what it sends the server
      await driver.setGeoLocation(-30, 30);
    });
    it('should get geolocation', async () => {
      let geo = await driver.getGeoLocation();
      should.exist(geo.latitude);
      should.exist(geo.longitude);
    });
    it('should get app source', async () => {
      let source = await driver.source();
      source.should.contain('<MockNavBar id="nav"');
    });
    // TODO do we want to test driver.pageIndex? probably not

    it('should get the orientation', async () => {
      (await driver.getOrientation()).should.equal("PORTRAIT");
    });
    it('should set the orientation to something valid', async () => {
      await driver.setOrientation("LANDSCAPE");
      (await driver.getOrientation()).should.equal("LANDSCAPE");
    });
    it('should not set the orientation to something invalid', async () => {
      await driver.setOrientation("INSIDEOUT")
              .should.eventually.be.rejectedWith(/Orientation must be/);
    });

    it('should get a screenshot', async () => {
      should.exist(await driver.takeScreenshot());
    });

  });
}

export default generalTests;
