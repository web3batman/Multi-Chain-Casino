import RsaWrapper from "./rsa-wrapper";

const rsaWrapper = new RsaWrapper();

rsaWrapper.generate("client");
rsaWrapper.generate("server");
