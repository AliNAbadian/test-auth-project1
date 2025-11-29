import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGallery } from './entities/user-gallery.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserGalleryService {
  constructor(
    @InjectRepository(UserGallery)
    private userGalleryRepo: Repository<UserGallery>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Upload thumbnail for user
  async uploadThumbnail(
    userId: string,
    file: Express.Multer.File,
    baseUrl: string,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const thumbnailUrl = `${baseUrl}/uploads/users/thumbnails/${file.filename}`;
    user.thumbnail = thumbnailUrl;

    return this.userRepo.save(user);
  }

  // Upload multiple gallery images for a user
  async uploadGalleryImages(
    userId: string,
    files: Array<Express.Multer.File>,
    baseUrl: string,
  ): Promise<UserGallery[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const uploaded: UserGallery[] = [];

    for (const file of files) {
      const galleryItem = this.userGalleryRepo.create({
        user,
        url: `${baseUrl}/uploads/users/gallery/${file.filename}`,
      });

      const saved = await this.userGalleryRepo.save(galleryItem);
      uploaded.push(saved);
    }

    return uploaded;
  }

  // Get all gallery images for a user
  async getUserGallery(userId: string): Promise<UserGallery[]> {
    return this.userGalleryRepo.find({
      where: { user: { id: userId } },
    });
  }

  // Delete a gallery image
  async removeGalleryImage(imageId: string, userId: string) {
    const gallery = await this.userGalleryRepo.findOne({
      where: { id: imageId, user: { id: userId } },
    });

    if (!gallery) {
      throw new BadRequestException('Image not found');
    }

    await this.userGalleryRepo.delete(imageId);
    return { message: 'Image deleted successfully' };
  }

  // Remove user thumbnail
  async removeThumbnail(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.thumbnail = null as any;
    return this.userRepo.save(user);
  }
}
