import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards';
import { User } from '@app/user/decorators/user.decorator';
import { IProfileResponse } from '@app/profile/types';

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

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
