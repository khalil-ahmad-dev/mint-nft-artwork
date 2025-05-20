import { Gavel, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { handleShowNotificationToast } from "@/lib/helpers";
import { useActiveAccount } from "thirdweb/react";
import { getContract, keccak256, prepareContractCall, sendTransaction, toBytes, waitForReceipt } from "thirdweb";
import { Environment } from "@/config";
import { currentChain, thirdWebClient } from "@/lib/thirdwebClient";

const urlRegex = /^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
const walletRegex = /^0x[a-fA-F0-9]{40}$/;

const formSchema = z.object({
  name: z.string().min(3, "NFT name must be at least 3 characters."),
  artist: z.string().min(3, "Artist name must be at least 3 characters."),
  url: z.string().refine(val => val.trim() !== "", {
    message: "URL is required.",
  }).refine(val => urlRegex.test(val), {
    message: "Please enter a valid URL.",
  }),
  totalShares: z.coerce.number().min(1, "Total shares must be at least 1"),
  owners: z
    .array(
      z.object({
        address: z.string().regex(walletRegex, "Invalid wallet address"),
        shares: z.coerce.number().min(1, "Share amount must be at least 1"),
      })
    )
    .optional(),
});

interface IProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MintArtworkDialog = ({ open, setOpen }: IProp) => {

  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerShares, setOwnerShares] = useState<number | undefined>(undefined);
  const [isMinting, setIsMinting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      artist: "",
      url: "",
      totalShares: 0,
      owners: [],
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  const activeAccount = useActiveAccount();

  const totalShares = Number(watch("totalShares"));
  const owners = watch("owners") || [];
  const totalAssigned = owners.reduce((sum, o) => sum + o.shares, 0);

  function generateArtworkHash(name: string): `0x${string}` {
    const timestamp = new Date().toISOString();
    const uniqueInput = `${name}-${timestamp}`;
    const hash = keccak256(toBytes(uniqueInput));
    return hash;
  }


  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    if (totalAssigned !== totalShares) {
      handleShowNotificationToast(
        "error",
        "Please assign all shares to owners.",
        "Total shares must be equal to the sum of assigned shares."
      );
      return;
    }

    console.log("Form values:", values);;

    const sharesArray = values.owners?.map(owner => BigInt(Number(owner.shares))) || [];
    const initialOwnersArray = values.owners?.map(owner => owner.address) || [];

    try {
      setIsMinting(true);

      const artContract = getContract({
        address: Environment.SMART_CONTRACT_ADDRESS,
        client: thirdWebClient,
        chain: currentChain,
      });

      const preparedTransaction = prepareContractCall({
        contract: artContract,
        method: `function createArtwork(string artworkId, string name, string artist, uint256 totalShares, string url, bytes32 artworkHash, address[] initialOwners, uint256[] shareAmounts)`,
        params: [
          `${values.name.trim()}-${values.artist.trim()}`,
          values.name || "Test NFT Artwork",
          values.artist || 'Test Artist',
          BigInt(Number(values.totalShares) || 1),
          values.url,
          generateArtworkHash(values.name || "Test NFT Artwork"),
          initialOwnersArray,
          sharesArray
        ],
      });

      const transactionRes = await sendTransaction({
        transaction: preparedTransaction,
        account: activeAccount!,
      });

      if (transactionRes) {
        console.log("Transaction Response:", transactionRes);

        const receipt = await waitForReceipt({
          client: thirdWebClient,
          chain: currentChain,
          transactionHash: transactionRes.transactionHash,
        });
        console.log("Receipt:", receipt);

        if (receipt && receipt.status === "success") {
          reset();
          handleShowNotificationToast(
            "success",
            "NFT Artwork Minted Successfully",
            "Your NFT artwork has been successfully minted."
          );

          setOpen(false);
        } else {
          throw new Error("Transaction failed");
        }
      }

    } catch (error) {
      console.error("Error:", error);
      handleShowNotificationToast(
        "error",
        "Error Minting NFT Artwork",
        "An error occurred while minting the NFT artwork. Please try again later."
      );

    } finally {
      setIsMinting(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-md lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Mint NFT Artwork</DialogTitle>
          <DialogDescription className="w-2/3">
            Fill out the form below with the required information for your NFT
            Artwork. This information will be used to create and mint your
            unique digital asset.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}  >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full" aria-disabled={isMinting} >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Name</FormLabel>
                  <FormControl>
                    <Input disabled={isMinting} placeholder="Input the NFT name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input disabled={isMinting} placeholder="Input the artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata URL</FormLabel>
                  <FormControl>
                    <Input disabled={isMinting} placeholder="Input the metadata URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="totalShares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Shares</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isMinting}
                      type="number"
                      placeholder="Enter total shares"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Owner input */}
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Assign Initial Owners</h4>

              <div className="flex gap-2">
                <div className="flex flex-col w-full">
                  <Input
                    disabled={isMinting}
                    placeholder="Wallet address"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                  />
                  {!walletRegex.test(ownerAddress) && ownerAddress && (
                    <p className="text-xs text-red-500 mt-1">Invalid wallet address.</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    disabled={isMinting}
                    type="number"
                    placeholder="Shares"
                    value={ownerShares ?? ""}
                    onChange={(e) =>
                      setOwnerShares(parseInt(e.target.value || "0", 10))
                    }
                  />
                  {ownerShares !== undefined &&
                    (ownerShares <= 0 ? (
                      <p className="text-xs text-red-500 mt-1">Shares must be a positive number.</p>
                    ) : totalAssigned + (ownerShares || 0) > totalShares ? (
                      <p className="text-xs text-red-500 mt-1">
                        Cannot assign more than remaining shares.
                      </p>
                    ) : null)}
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    const remaining = totalShares - totalAssigned;
                    if (!walletRegex.test(ownerAddress)) return;
                    if (!ownerShares || ownerShares <= 0) return;
                    if (ownerShares > remaining) return;

                    append({ address: ownerAddress, shares: ownerShares });
                    setOwnerAddress("");
                    setOwnerShares(undefined);
                  }}

                  disabled={
                    !walletRegex.test(ownerAddress) ||
                    !ownerShares ||
                    ownerShares <= 0 ||
                    totalAssigned + (ownerShares || 0) > totalShares
                    || isMinting
                  }
                >
                  Add
                </Button>
              </div>

              <ul className="text-sm list-inside space-y-1">
                {fields.map((field, index) => (
                  <li key={field.id}>
                    <div className="flex items-center gap-2">
                      <Input
                        value={field.address}
                        onChange={(e) =>
                          setValue(`owners.${index}.address`, e.target.value)
                        }
                        placeholder="Wallet address"
                        disabled={isMinting}
                      />
                      <Input
                        type="number"
                        value={field.shares}
                        onChange={(e) =>
                          setValue(
                            `owners.${index}.shares`,
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        placeholder="Shares"
                        disabled={isMinting}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(index)}
                        className="rounded-full size-6"
                      >
                        <Minus />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-muted-foreground">
                Total Assigned: {totalAssigned} / {totalShares}
              </p>
            </div>


            <div className="flex justify-end items-center gap-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isMinting} >
                  Close
                </Button>
              </DialogClose>

              <Button type="submit" isLoading={isMinting} >
                <Gavel className="mr-2 h-4 w-4" />
                Mint NFT
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MintArtworkDialog;
