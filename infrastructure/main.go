package main

import (
	"github.com/dogmatiq/ferrite"
	"github.com/pulumi/pulumi-cloudflare/sdk/v5/go/cloudflare"
	"github.com/pulumi/pulumi-digitalocean/sdk/v4/go/digitalocean"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

var (
	DROPLET_INSTANCE_NAME = ferrite.
				String("DROPLET_INSTANCE_NAME", "Unique name for droplet").
				Required()
	CLOUDFLARE_ZONE_ID = ferrite.
				String("CLOUDFLARE_ZONE_ID", "Cloudflare zone id").
				Required()
	CLOUDFLARE_API_TOKEN = ferrite.
				String("CLOUDFLARE_API_TOKEN", "Cloudflare API token").
				Required()
	DO_SSH_PUBLIC_KEY = ferrite.
				String("DO_SSH_PUBLIC_KEY", "SSH key for this droplet").
				Required()
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		droplet, err := digitalocean.NewDroplet(ctx, DROPLET_INSTANCE_NAME.Value(), &digitalocean.DropletArgs{
			Image:   pulumi.String("ubuntu-24-10-x64"),
			Name:    pulumi.String(DROPLET_INSTANCE_NAME.Value()),
			Region:  pulumi.String(digitalocean.RegionSYD1),
			Size:    pulumi.String(digitalocean.DropletSlugDropletS1VCPU1GB),
			Backups: pulumi.Bool(true),
			SshKeys: pulumi.ToStringArray([]string{
				DO_SSH_PUBLIC_KEY.Value(),
			}),
		})
		if err != nil {
			return err
		}

		ctx.Export("id", droplet.ID())

		droplet.ID().ApplyT(func(dropletId int) error {
			static, err := digitalocean.NewReservedIp(ctx, DROPLET_INSTANCE_NAME.Value(), &digitalocean.ReservedIpArgs{
				DropletId: pulumi.Int(dropletId),
				Region:    pulumi.String(digitalocean.RegionSYD1),
			})
			if err != nil {
				return err
			}

			ctx.Export("staticAddress", static.IpAddress)

			_, err = cloudflare.NewRecord(ctx, DROPLET_INSTANCE_NAME.Value(), &cloudflare.RecordArgs{
				ZoneId:  pulumi.String(CLOUDFLARE_ZONE_ID.Value()),
				Name:    pulumi.String("@"),
				Content: static.IpAddress,
				Type:    pulumi.String("A"),
				Proxied: pulumi.Bool(true),
			})
			if err != nil {
				return err
			}

			return nil
		})

		return nil
	})
}
