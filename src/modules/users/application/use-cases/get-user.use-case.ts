import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../../common/exceptions/user-not-found.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

@Injectable()
export class GetUserUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(GetUserUseCase.name);
  }

  async execute(userId: string): Promise<User> {
    this.logger.debug(`GetUser: id=${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    this.logger.log(`Usuario encontrado: id=${user.id}, email=${user.email}`);
    return user;
  }
}
