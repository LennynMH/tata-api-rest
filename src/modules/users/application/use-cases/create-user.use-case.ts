import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUserRepository, USER_REPOSITORY } from '../ports/user.repository.port';
import { IRoleRepository, ROLE_REPOSITORY } from '../ports/role.repository.port';
import { IStateUserRepository, STATE_USER_REPOSITORY } from '../ports/state-user.repository.port';
import { IPasswordHasher, PASSWORD_HASHER } from '../../../../common/contracts/password-hasher.contract';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { User } from '../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../../../common/exceptions/user-already-exists.exception';
import { InvalidRoleException } from '../../../../common/exceptions/invalid-role.exception';
import { StateUserNotFoundException } from '../../../../common/exceptions/state-user-not-found.exception';
import { ROLE_CODE_DEFAULT } from '../../../../common/constants/role.constants';
import { STATE_USER_CODE_DEFAULT } from '../../../../common/constants/state-user.constants';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role_cod?: string;
}

@Injectable()
export class CreateUserUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(STATE_USER_REPOSITORY)
    private readonly stateUserRepository: IStateUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(CreateUserUseCase.name);
  }

  async execute(input: CreateUserInput): Promise<User> {
    const roleCode = input.role_cod ?? ROLE_CODE_DEFAULT;
    this.logger.debug(`CreateUser: email=${input.email}, role_cod=${roleCode}`);

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(input.email);
    }

    const role = await this.roleRepository.findByCode(roleCode);
    if (!role) {
      throw new InvalidRoleException(roleCode);
    }

    const state = await this.stateUserRepository.findByCode(STATE_USER_CODE_DEFAULT);
    if (!state) {
      throw new StateUserNotFoundException(STATE_USER_CODE_DEFAULT);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = User.create(
      randomUUID(),
      input.email.toLowerCase().trim(),
      passwordHash,
      input.name.trim(),
      role,
      state,
    );

    const saved = await this.userRepository.save(user);
    this.logger.log(`Usuario creado: id=${saved.id}, email=${saved.email}`);
    return saved;
  }
}
