import { getCloudinarySignature } from '../operations/uploads.controller.js';
import cloudinary from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    utils: {
      api_sign_request: jest.fn(),
    },
  },
}));

describe('getCloudinarySignature', () => {
  it('returns signature and timestamp', () => {
    cloudinary.v2.utils.api_sign_request.mockReturnValue('signed123');

    const req = { body: { folder: 'attendances' } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status };

    getCloudinarySignature(req, res);

    expect(cloudinary.v2.utils.api_sign_request).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
