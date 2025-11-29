import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import { BlogResponseDto, DeleteBlogResponseDto } from './dto/response/blog-response.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new blog post',
    description: 'Create a new blog post with title, content, and optional thumbnail',
  })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid blog data', type: ErrorResponseDto })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all blog posts',
    description: 'Returns all blog posts',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all blog posts',
    type: [BlogResponseDto],
  })
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get blog post by ID',
    description: 'Returns a single blog post by ID',
  })
  @ApiParam({ name: 'id', description: 'Blog post ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Returns blog post details',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a blog post',
    description: 'Update blog post information',
  })
  @ApiParam({ name: 'id', description: 'Blog post ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found', type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a blog post',
    description: 'Permanently delete a blog post',
  })
  @ApiParam({ name: 'id', description: 'Blog post ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Blog post deleted successfully',
    type: DeleteBlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found', type: ErrorResponseDto })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
