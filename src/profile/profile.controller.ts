import { Controller, Get, Param } from '@nestjs/common';

import { User } from '@app/user/decorators/user.decorator';
import { IProfileResponse } from '@app/profile/types';
import { ProfileService } from '@app/profile/profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':name')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('name') profileUsername: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
