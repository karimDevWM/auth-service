import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/typeorm/entities/Role';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles = ['admin', 'member'];
    for (const roleName of roles) {
      const roleExists = await this.roleRepository.findOne({
        where: { roleName: roleName },
      });
      if (!roleExists) {
        const role = this.roleRepository.create({ roleName: roleName });
        await this.roleRepository.save(role);
      }
    }
  }
}
