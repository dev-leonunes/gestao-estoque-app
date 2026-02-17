import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok when DB is reachable', async () => {
    const mockDataSource = {
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as unknown as DataSource;

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    const controller = moduleRef.get(HealthController);
    await expect(controller.db()).resolves.toEqual({ status: 'ok' });
    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('throws 503 when DB is unavailable', async () => {
    const mockDataSource = {
      query: jest.fn().mockRejectedValue(new Error('db down')),
    } as unknown as DataSource;

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    const controller = moduleRef.get(HealthController);
    await expect(controller.db()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
